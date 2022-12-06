const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const Users = require('./users.model')
const { Model } = require('./Model');
const PostLike = require('./post_likes.model');


class Posts extends Model {
    constructor(tableName) {
        super(tableName);
    }

    async create(params) {
        const author_id = mysql.escape(params.author_id);
        const title = mysql.escape(params.title);
        const content = mysql.escape(params.content);

        let sql = `INSERT INTO\
                ${this.tableName}(author_id, title, content, created_at)\
                VALUES(${author_id}, ${title}, ${content}, NOW())`;
        return await dbConnection.query(sql);
    }

    async modify(params) {
        const post_id = mysql.escape(params.post_id);
        const title = mysql.escape(params.title);
        const content = mysql.escape(params.content)

        let sql = `UPDATE ${this.tableName}\
                    SET title = IF(${title} IS NULL, title, ${title}),\
                        content = IF(${content} IS NULL, content, ${content})\
                    WHERE (id = ${post_id})`;
        return await dbConnection.query(sql);
    }

    async delete(params) {
        const post_id = mysql.escape(params.post_id);
        const author_id = mysql.escape(params.author_id);
        let sql = `DELETE FROM ${this.tableName} WHERE id=${post_id} AND author_id=${author_id}`;
        return await dbConnection.query(sql);
    }

    async fetchPostWithAuthor(params) {
        const post_id = mysql.escape(params.post_id);

        const p = this.tableName;
        const u = Users.tableName;

        let sql = `SELECT ${p}.id, ${p}.author_id, ${p}.title, ${p}.content, ${p}.created_at,\
                        ${u}.email, ${u}.username, ${u}.avatar_url\
                    FROM ${p} INNER JOIN ${u} ON ${p}.author_id = ${u}.id\
                    WHERE ${p}.id = ${post_id}`;
        return await dbConnection.query(sql);
    }


    async getFeaturedAuthorsTop3() {
        const postTable = this.tableName;
        const postLikeTable = PostLike.tableName;

        let sql = `SELECT ${postTable}.author_id, COUNT(${postTable}.id) AS numOfPost, 
                        (SELECT COUNT(${postLikeTable}.id) 
                        FROM ${postLikeTable} 
                        WHERE ${postTable}.id = ${postLikeTable}.post_id)
                        AS numOfLike
                    FROM ${postTable} 
                    GROUP BY ${postTable}.author_id 
                    ORDER BY numOfLike DESC, numOfPost DESC LIMIT 3;`

        return await dbConnection.query(sql);
    }

    async getHotPost() {
        const postTable = this.tableName;
        const postLikeTable = PostLike.tableName;

        let sql = `SELECT `
    }


}

module.exports = new Posts("posts")