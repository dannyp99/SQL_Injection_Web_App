var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var fs = require('fs');
const cors = require('@koa/cors');
const KoaStatic = require('koa-static');
const Router = require('@koa/router');
const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'student_info'
});

let file_server = KoaStatic("./web");

connection.connect((err) => {
	if (err) {
		console.log('Error connecting to MySQL database: ', err);
		return;
	}
	console.log('MySQL successfully connected');
});

var app = new Koa();
var router = new Router();

var port = 3000;

router.get('/', async (context, next) => {
	context.response.body = 'Great success!'
});

router.get('/students/:id,:password', async (context, next) => {
	try {
		let res;
		connection.query(`SELECT StudentGrade FROM Students WHERE StudentID = ${"'" + context.params.id + "'"} AND password = ${"'" + context.params.password + " '"} LIMIT 1;`, (err, results, fields) => {
			if (err) {
				console.log(err);
				context.response.status = 400;
				return;
			}
		});
		const res = ['A', 'A-', 'B', 'FLAG_1', 'C', 'Flag_2'];//results.map(x => x.StudentGrade).join(", ")
		console.log(res);
		context.response.body = res;
		context.response.status = 200;
	} catch (err) {
		console.log(err);
		context.response.status = 400;
	}
});

app.use(cors());
app.use(file_server);
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
	console.log("Server is running at localhost:", port);
});
