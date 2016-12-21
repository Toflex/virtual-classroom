config = require('./config').config;
const express = require("express");
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let mysql = require('mysql');
let connection = mysql.createConnection(config.db);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', function (req, res) {
    res.render('home');
});
app.get('/getLesson', function (req, res) {
    connection.query('SELECT * FROM content_blocks', function (a, b, c) {
        res.send(b);
    })
});

app.get('/getUsers', function (req, res) {
    connection.query('SELECT id, name FROM users WHERE type = "student"', function (a, b, c) {
        res.send(b);
    })
});
let connects = {};
let connID = [];

io.on('connection', function (socket) {
    let sid = socket.id;
    let cid, classID, CusID;
    let user = {};
    socket.on('login', function (msg) {
        let query = "SELECT * FROM users WHERE `email` = '" + msg.email + "' AND `password` = MD5('" + msg.password + "')";
        let user = connection.query(query, function (err, rows, fields) {
            if (err) throw err;
            if (rows.length == 0) io.to(sid).emit('loginError');
            else {
                user = rows[0];
                connection.query('DELETE FROM sessions WHERE `user_id`=' + rows[0].id);
                connection.query("INSERT INTO sessions (`id`,`user_id`) VALUES('" + sid + "'," + rows[0].id + ")");
                connection.query('SELECT user_id FROM sessions GROUP BY user_id', function (a, b, c) {
                    if (a) throw a;
                    io.to(sid).emit('loginSuccess', {name: rows[0].name, type: rows[0].type, id: sid, online: b});
                });

                connection.query('SELECT user_id FROM sessions GROUP BY user_id', function (a, b, c) {
                    if (a) throw a;
                    if (b.length > 0) {
                        online = [];
                        b.forEach(function (item) {
                            online.push(item.user_id);
                        });
                        socket.broadcast.emit('online', online);
                    }
                })

            }
        });
    });
    socket.on('init', function (msg) {
        let query = "SELECT * FROM sessions WHERE id = '" + msg + "'";
        console.log(query);
        let session = connection.query(query, function (err, rows, fields) {
            console.log(rows);
            if (err) throw err;
            if (rows.length == 0) io.to(sid).emit('initError');
            else {
                let user_query = "SELECT * FROM users WHERE `id` = " + rows[0].user_id;
                console.log(user_query);
                let user = connection.query(user_query, function (user_err, user_rows, user_fields) {
                    console.log(user_rows);
                    if (user_err) throw user_err;
                    if (user_rows.length == 0) io.to(sid).emit('initError');
                    else {
                        let delQuery = 'DELETE FROM sessions WHERE `user_id`=' + rows[0].user_id;
                        let insQuery = "INSERT INTO sessions (`id`,`user_id`) VALUES('" + sid + "', " + rows[0].user_id + ")";

                        console.log(delQuery);
                        console.log(insQuery);

                        connection.query(delQuery);
                        connection.query(insQuery);

                        io.to(sid).emit('loginSuccess', {name: user_rows[0].name, type: user_rows[0].type, id: sid});

                        connection.query('SELECT user_id FROM sessions GROUP BY user_id', function (a, b, c) {
                            if (a) throw a;
                            if (b.length > 0) {
                                online = [];
                                b.forEach(function (item) {
                                    online.push(item.user_id);
                                });
                                console.log(online);
                                socket.broadcast.emit('online', online);
                            }
                        })
                    }

                });
            }
        })
    });
    socket.on('logout', function () {

        connection.query('DELETE FROM sessions WHERE `user_id`="' + user.id + '"', function () {
            io.to(sid).emit('logout');
            connection.query('SELECT user_id FROM sessions GROUP BY user_id', function (a, b, c) {
                if (a) throw a;
                if (b.length > 0) {
                    online = [];
                    b.forEach(function (item) {
                        online.push(item.user_id);
                    });
                    console.log(online);
                    socket.broadcast.emit('online', online);
                }
            })
        });

    });
    socket.on('getCourseName', function () {
        io.to(sid).emit('getCourseName', 'Javascript basic')
    });
    socket.on('getOnline', function () {
        connection.query('SELECT user_id FROM sessions GROUP BY user_id', function (a, b, c) {
            if (a) throw a;
            if (b.length > 0) {
                online = [];
                b.forEach(function (item) {
                    online.push(item.user_id);
                });
                console.log(online);
                socket.broadcast.emit('online', online);
            }
        })
    });
    socket.on('display', function (data) {
        socket.broadcast.emit('display', {num: data.num, act: data.act});
    });
    socket.on('disconnect', function () {
        // connection.query('DELETE FROM sessions WHERE `id`="' + sid + '"');
    });
});

app.listen(config.httpPort, function (err) {
    console.log('Listening at http://localhost:' + config.httpPort);
});
http.listen(config.socketPort);
