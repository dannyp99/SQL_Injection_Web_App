var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var fs = require('fs');
const cors = require('@koa/cors');
const KoaStatic = require('koa-static');
const Router = require('@koa/router');
const mysql = require('mariadb');
const connection = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'student_info'
});

let file_server = KoaStatic("./web");

var db = connection.getConnection();
db.then((con) => {
	console.log("Database Connected");
	con.end();
})
.catch(err => {
	console.log(err);
});

var app = new Koa();
var router = new Router();

var port = 3000;

router.get('/:id', async (context, next) => {
	console.log("studentID", context.params.id);
	const query = `SELECT StudentID, password FROM Students WHERE StudentID = ${ connection.escape(context.params.id) } LIMIT 1;`;
	let conn;
	try {
		conn = await connection.getConnection();
		const results = await conn.query(query);
		const res = results;
		console.log(res);
		context.response.body = res;
		context.response.status = 200;
	} catch (err) {
		console.error(err);
	} finally {
		if (conn) { conn.end(); }
	}
});

router.get('/students/:id,:password', async (context, next) => {
	const query = `SELECT * FROM Students WHERE StudentID = ${"'" + context.params.id + "'"} AND password = ${"'" + context.params.password + " '"} LIMIT 1;`;
	let conn;
	try {
		conn = await connection.getConnection();
		const results = await conn.query(query);
		const res = results.map(x => x.StudentGrade);
		context.response.body = res;
		context.response.status = 200;
	} catch (err) {
		console.error(err);
	} finally {
		if (conn) { conn.end(); }
	}
});

app.use(cors());
app.use(file_server);
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
	console.log("Server is running at localhost:", port);
});
