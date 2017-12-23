'use strict';
const log = console.log;
const MongoClient = require('mongodb').MongoClient;
const config = require('../config/GlobalConfig.js').mongodb;

let G_DB = null,
	G_Client = null;

/**
 * 描述：数据库连接
 */
async function connectDB({
	host = '127.0.0.1',
	port = 27017,
	database = 'test',
	needAuth = false
} = {}) {
	let DBConnString = '';
	if (needAuth) {
		DBConnString = `mongodb://${config.user}:${config.passwd}@${host}:${port}/${database}`;
	} else {
		DBConnString = `mongodb://${host}:${port}/${database}`;
	}

	try {
		let options = {
			poolSize:100
		};
		G_Client = await MongoClient.connect(DBConnString,options);
		G_DB = G_Client.db(database);
	} catch (err) {
		log(err.stack);
	}
	return G_DB;
}

/**
 * 描述：获取数据库连接
 */
async function getDBInstance() {
	if (!!G_DB) {
		return G_DB;
	} else {
		G_DB = await connectDB(config);
		return G_DB;
	}
}
exports.getDBInstance = getDBInstance;

async function close() {
	if (G_Client) {
		G_Client.close();
	}
}
exports.close = close;

/**
 * 根据query查询集合collection,返回对应集合里面的所有查询到的记录
 *
 * @param collection {String}  集合的名字
 * @param query      {Object}  查询条件
 * @param filter     {Object}  字段过滤器
 * @returns {Promise-resolve-Array}   由多个记录文档组成的Array
 */
async function getCollectionAllDocsByQuery(collection = null, query = null, filter = null) {
	let data = [];
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		data = await col.find(query, {
			projection: filter
		}).toArray();
		// close();
	} catch (e) {
		log(e);
	}
	return data;
}
exports.findAllByKey = getCollectionAllDocsByQuery;
// getCollectionAllDocsByQuery('user',null,{_id:0}).then(x=>{log(x)})

/**
 * 根据集合的名字，返回对应集合里面的所有记录
 *
 * @param collection {String}  集合的名字
 * @returns {Promise-resolve-Array}   由多个记录文档组成的Array
 */
function getCollectionAllDocs(collection) {
	return getCollectionAllDocsByQuery(collection);
}
exports.findAllWithoutKey = getCollectionAllDocs;
// getCollectionAllDocs('user').then(x=>{log(x)});

/**
 * 根据query查询集合collection,返回对应集合里面的所有查询到的记录中的一条记录(记录中除去了filter字段),
 * 该函数如果没有任务记录项与查询条件匹配的话， 认为该情况是promise的成功态
 *
 * @param collection {String}  集合的名字
 * @param query      {Object}  查询条件
 * @param filter     {Object}  字段过滤对象
 * @returns {Promise-resolve-Object}   记录文档
 */
async function getCollectionOneDocByQuery(collection = null, query = null, filter = null) {
	let data = [];
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		data = await col.find(query, {
			projection: filter
		}).limit(1).toArray();
	} catch (e) {
		log(e);
	}
	return data[0];
}
exports.findOne = getCollectionOneDocByQuery;
// getCollectionOneDocByQuery('user',null,{_id:0}).then(x=>{log(x)})

/**
 * 根据query查询集合collection,返回对应集合里面的所有查询到的记录中的一条记录(记录中除去了filter字段),
 * 该函数如果没有任务记录项与查询条件匹配的话， 认为该情况是promise的失败态
 *
 * @param collection {String}  集合的名字
 * @param query    {Object}  查询条件
 * @param filter     {Object}  字段过滤对象
 * @returns {Promise-resolve-Object}   记录文档
 */
function getCollectionOneDocNullAsErr(collection, query, filter) {
	var promise = getCollectionOneDocByQuery(collection, query, filter);
	return promise.then(function (resolve, reject) {
		if (resolve) {
			return resolve;
		} else if (reject) {
			return Promise.reject(reject);
		} else {
			var DocNullErr = new Error('getCollectionOneDocNullAsErr get none doc by: ' + JSON.stringify(query));
			DocNullErr.name = 'DocNullErr';
			Error.captureStackTrace(DocNullErr);
			return Promise.reject(DocNullErr.stack);
		}
	});
}
exports.findOneNullAsErr = getCollectionOneDocNullAsErr;
// getCollectionOneDocNullAsErr('test').then(x=>{log(x)})

/**
 * 将data指定的单个记录插入collection指定的集合中
 *
 * @param collection    {String}   集合的名字
 * @param obj          {Object}   具体插入的数据
 * @returns {Promise-resolve-Object}   具体插入的数据
 */
async function insertOneDoc(collection = null, obj = {}) {
	let rs = {};
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		let r = await col.insertOne(obj);
		rs.insertedCount = r.insertedCount;
	} catch (e) {
		log(e);
	}
	return rs;
}
exports.insertOne = insertOneDoc;
// insertOneDoc('test',[{hh:'hh'}]).then(x=>{log(x)})

/**
 * 将objs指定的多个记录插入collection指定的集合中
 *
 * @param collection    {String}   集合的名字
 * @param objs          {Array}   具体插入的数据
 * @returns {Promise-resolve-Array}   具体插入的数据
 */
async function insertManyDocs(collection = null, objs = []) {
	let rs = {};
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		let r = await col.insertMany(objs);
		rs.insertedCount = r.insertedCount;
	} catch (e) {
		log(e);
	}
	return rs;
}
exports.insertMany = insertManyDocs;
// insertManyDocs('test',[]).then(x=>{log(x)})

/**
 * 根据query查询集合collection，修改匹配到的第一个文档，且返回的数据是修改之后的文档
 * 如果没有匹配到文档，则认为是错误
 *
 * @param collection  {String}   集合的名字
 * @param query     {Object}    查询条件
 * @param obj        {Object}    更新的数据
 * @returns {Promise-resolve-Object}   更新的数据
 */
async function updateOne(collection = null, query = {}, obj = {}) {
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		let r = await col.findAndModify(query, null, {
			$set: obj
		}, {
			new: true
		});
		let lastErrorObject = r.lastErrorObject;
		if ((lastErrorObject.updatedExisting === true) && (lastErrorObject.n === 1)) {
			return r.value;
		} else {
			return lastErrorObject;
		}
	} catch (e) {
		log(e);
	}
}
exports.updateOne = updateOne;
// updateOne('test',{hh:'hh'},{name:'testxxxx'}).then(x=>{log(x)})

/**
 * 根据query查询集合collection，修改文档
 *     1. 如果没有匹配到文档， 则插入一条新的记录
 *     2. 如果匹配到唯一一个文档，则更新该文档的字段
 *     3. 如果匹配到多个文档， 则对第一个文档进行更新操作（更新obj指定的字段）
 *
 * @param collection  {String}   集合的名字
 * @param query     {Object}    查询条件
 * @param obj        {Object}    更新的数据
 * @returns {Promise-resolve-Object}   更新的数据
 */
async function upsertOne(collection = null, query = {}, obj = {}) {
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		let r = await col.findAndModify(query, null, {
			$set: obj
		}, {
			new: true,
			upsert: true
		});
		let lastErrorObject = r.lastErrorObject;
		if (lastErrorObject && (lastErrorObject.n === 1)) {
			return r.value;
		} else {
			return lastErrorObject;
		}
	} catch (e) {
		log(e);
	}
}
exports.upsertOne = upsertOne;
// upsertOne('test',{name:'testxxxx'},{namess:'123456789'}).then(x=>{log(x)})

/**
 * 注意该方法和之前的update、upsert不同， 前面的两个更新方法， 更新的是document里面的字段,
 * 而该方法是直接更新该文档， 使用obj来替代现有的文档。
 * 该函数只能更新一个文档，不支持一次update多个文档
 * 
 * 1. 如果没有匹配到文档，返回Promise->reject状态
 * 2. 如果匹配到多个文档，则对匹配到的第一个文档进行update操作，其他的文档不会被影响
 * 3. 如果匹配到单个文档，则对该文档进行update操作
 * 操作成功返回Promise->resolve状态
 *
 * resolve:
 *    obj   插入的数据
 * reject:
 * { ok: 1, nModified: 0, n: 0 }           by reject
 * https://docs.mongodb.org/manual/reference/command/update/#dbcmd.update
 *
 * @param collection  {String}    集合的名字
 * @param query       {Object}    查询条件
 * @param obj         {Object}    更新的数据
 * @returns {Promise-resolve-Object}   更新的数据
 */
async function modify(collection = null, query = {}, obj = {}) {
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		let r = await col.update(query, obj);
		let result = r.result;
		if (result && result.ok === 1 && result.nModified === 1) {
			return obj;
		} else {
			return result;
		}
	} catch (e) {
		log(e);
	}
}
exports.modifyOne = modify;
// modify('test',{"qwer" : "123"},{"hh" : "123456"}).then(x=>{log(x)})

/**
 * 删除所有匹配条件的文档
 * 
 * @param collection   {String}  集合的名字
 * @param query        {Object}  查询条件
 * @returns {Promise-resolve-object}
 */
async function removeByKey(collection, query) {
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		let r = await col.remove(query);
		return r.result;
	} catch (e) {
		log(e);
	}
}
exports.remove = removeByKey;
// removeByKey('test',{"name" : "testxxxx"}).then(x=>{log(x)})

/**
 * 删除集合
 * 
 * @param collection  {String}   集合名
 */
async function dropCollection(collection) {
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		let r = await col.drop();
		return r.result;
	} catch (e) {
		log(e);
	}
}
exports.drop = dropCollection;
// dropCollection('test').then(x=>{log(x)});

/**
 * 修改整个文档，文档存在，修改第一条，文档不存在，则添加一条
 * 
 * @param   collection  {String}   集合名
 * @param   query       {Object}   查询条件
 * @param   obj         {Object}   更新数据
 * @returns {Promise-resolve-Object}   修改之后的文档
 */
async function findAndModify(collection, query, obj) {
	try {
		let db = await getDBInstance();
		let col = db.collection(collection);
		let r = await col.findAndModify(query, [], obj, {
			new: true,
			upsert: true
		});

		let lastErrorObject = r.lastErrorObject;
		if (lastErrorObject && (lastErrorObject.n === 1)) {
			return r.value;
		} else {
			return lastErrorObject;
		}
	} catch (e) {
		log(e);
	}
}
exports.findAndModify = findAndModify;
// findAndModify('test',{hh:123},{hh:123456}).then(x=>{log(x)});