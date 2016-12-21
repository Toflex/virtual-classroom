let sid = reactCookie.load('sid');
let socket = io.connect('//localhost:3000');

let LoginForm = React.createClass({
    componentDidMount() {
        socket.on('loginError', this.loginError);
    },
    loginError: function () {
        this.setState({error: <div className="alert alert-danger">Wrong email or password</div>});
    },
    emitLogin: function () {
        socket.emit('login', {
            email: this.refs.email.value,
            password: this.refs.password.value
        });
    },
    getInitialState(){
        return {error: ''}
    },
    render: function () {
        return <div className="container" id="form-signin">
            <form>
                <h2>Please login</h2>
                {this.state.error}
                <div className="form-group">
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <div className="input-group">
                        <div className="input-group-addon"><i className="glyphicon glyphicon-envelope"/></div>
                        <input type="email" className="form-control" id="email" ref="email"
                               defaultValue={this.props.defaultEmail} placeholder="Email"/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="sr-only">Password</label>
                    <div className="input-group">
                        <div className="input-group-addon"><i className="glyphicon glyphicon-lock"/></div>
                        <input type="password" className="form-control" id="password" ref="password"
                               placeholder="Password"/>
                    </div>
                </div>
                <button type="button" className="btn btn-lg btn-primary btn-block" onClick={this.emitLogin}>Sign me in
                </button>
            </form>
        </div>
    }
});

let Header = React.createClass({
    componentDidMount() {
        socket.on('getCourseName', this.setCourseName);
        socket.emit('getCourseName');
    },
    setCourseName(name) {
        this.state.course = name;
        this.setState(this.state);
    },
    logOut: function () {
        socket.emit('logout');
    },
    getInitialState(){
        return {course: ''}
    },
    render: function () {
        return <div className="row">
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <span className="navbar-brand">Virtual classroom</span>
                    </div>
                    <ul className="nav navbar-nav  navbar-left">
                        <li><a href="#">Hello, {this.props.userName}</a></li>
                    </ul>
                    <div className="nav navbar-nav navbar-right">
                        <ul className="nav navbar-nav">
                            <li className="active"><a href="#">Course: {this.state.course}</a></li>
                            <li><a href="javascript:" onClick={this.logOut}>Log out</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>;
    }
});

let TeacherBlock = React.createClass({
    componentDidMount(){
    },
    changeDisplay: function () {
        if (this.state.panelClass == "panel panel-primary hide-body") this.state.panelClass = "panel panel-primary";
        else this.state.panelClass = "panel panel-primary hide-body";
        this.setState(this.state);
    },

    getInitialState(){
        return {
            panelClass: "panel panel-primary hide-body",
            viewClass: "hide-std block-view pull-right"
        }
    },
    emitDisplay: function () {

        if (this.state.viewClass == "hide-std block-view pull-right") {
            this.state.viewClass = "block-view pull-right";
            socket.emit('display', {num: this.props.num, act: 1});
        }
        else {
            this.state.viewClass = "hide-std block-view pull-right";
            socket.emit('display', {num: this.props.num, act: 0});
        }
        this.setState(this.state);
    },
    render: function () {
        return <div key={this.props.id} className={this.state.panelClass}>
            <div className="panel-heading">{this.props.name}
                <a href="javascript:" className={this.state.viewClass} onClick={this.emitDisplay}>
                    <i className="glyphicon glyphicon-eye-open"></i>
                    <i className="glyphicon glyphicon-eye-close"></i>
                </a>
                <a href="javascript:" onClick={this.changeDisplay} className="block-control pull-right">
                    <i className="glyphicon glyphicon-plus"></i>
                    <i className="glyphicon glyphicon-minus"></i>
                </a>
            </div>
            <div className="panel-body" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
        </div>
    }
});

let TeacherPanel = React.createClass({
    componentDidMount() {
        let that = this;
        axios.get('/getLesson').then(function (data) {
            that.setState({blocks: data.data});
        }).catch()
    },
    getInitialState(){
        return {blocks: []}
    },
    render: function () {
        return <div>
            {
                this.state.blocks.map(function (data, key) {
                    if (data.type == 'lesson') {
                        return <TeacherBlock key={data.id} num={data.id} name={data.name} content={data.content}/>
                    }
                })
            }
        </div>
    }

});

let TeacherSidebarItem = React.createClass({
    componentDidMount(){
        socket.on('online', this.checkOnline);
    },
    checkOnline(online) {
        let that = this;
        let isOnline = false;
        online.forEach(function (item) {
            if (item == that.props.num) {
                that.setState({liClass: 'active'});
                isOnline = true
            }

        });
        if (!isOnline) that.setState({liClass: ''});
    },
    getInitialState(){
        return {liClass: ''}
    },
    render: function () {
        return <li className={this.state.liClass}><i className="glyphicon glyphicon-user"></i> {this.props.name}</li>
    }
});


let TeacherSideBar = React.createClass({
    componentDidMount() {
        let that = this;
        axios.get('/getUsers').then(function (data) {
            that.setState({users: data.data});
            socket.emit('getOnline');
        }).catch()
    },
    getInitialState(){
        return {users: []}
    },
    render: function () {
        return <div className="side-bar">
            <ul>
                {
                    this.state.users.map(function (data) {
                        return <TeacherSidebarItem key={data.id} num={data.id} name={data.name}/>
                    })
                }
            </ul>
        </div>
    }
});

let TeacherLayout = React.createClass({
    render: function () {
        return <div className="container main-container">
            <Header userName={this.props.userName}/>
            <div className="row">
                <div className="col-sm-3"><TeacherSideBar/></div>
                <div className="col-sm-9"><TeacherPanel/></div>
            </div>

        </div>
    }
});


let Block = React.createClass({
    componentDidMount(){
        let that = this;
        socket.on('display', function (data) {
            if (data.num == that.props.num) {
                if (data.act == 0) {
                    that.state.panelClass = "panel panel-primary hide";
                    that.setState(that.state);
                } else {
                    that.state.panelClass = "panel panel-primary";
                    that.setState(that.state);
                }
            }
        });
    },
    getInitialState(){
        return {
            panelClass: "panel panel-primary hide"
        };
    },
    render: function () {
        return <div key={this.props.id} className={this.state.panelClass}>
            <div className="panel-heading">{this.props.name}</div>
            <div className="panel-body" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
        </div>
    }
});

let BlackBoard = React.createClass({
    componentDidMount() {
        let that = this;
        axios.get('/getLesson').then(function (data) {
            that.setState({blocks: data.data});
        }).catch()
    },
    getInitialState(){
        return {blocks: []}
    },
    render: function () {
        return <div>
            {
                this.state.blocks.map(function (data, key) {
                    if (data.type == 'lesson') {
                        return <Block key={data.id} num={data.id} name={data.name} content={data.content}/>
                    }
                })
            }
        </div>
    }

});

let StudentLayout = React.createClass({
    render: function () {
        return <div className="container  main-container" id="student">
            <Header userName={this.props.userName}/>
            <BlackBoard/>
        </div>
    }
});


if (sid == null) {
    ReactDOM.render(
        <div>
            <LoginForm defaultEmail="student1@mail.com"/>
        </div>
        ,
        document.getElementById('root')
    );
} else {
    socket.emit('init', sid);
}

socket.on('logout', function () {
    sid = null;
    reactCookie.remove('sid');
    ReactDOM.render(
        <div>
            <LoginForm defaultEmail="student1@mail.com"/>
        </div>
        ,
        document.getElementById('root')
    );
});

socket.on('initError', function () {
    sid = null;
    ReactDOM.render(
        <div>
            <LoginForm defaultEmail="student1@mail.com"/>
        </div>
        ,
        document.getElementById('root')
    );
});

socket.on('loginSuccess', function (data) {
    if (data.type == 'teacher') {
        ReactDOM.render(
            <div><TeacherLayout userName={data.name}/></div>,
            document.getElementById('root')
        );
    } else {
        ReactDOM.render(
            <div><StudentLayout userName={data.name}/></div>,
            document.getElementById('root')
        );
    }
    reactCookie.save('sid', data.id);
});



