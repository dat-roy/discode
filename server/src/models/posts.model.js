const mysql = require('mysql2/promise');
const dbConnection = require("../config/db/index.db");
const { TABLES } = require('./config');
const { Model } = require('./Model');

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
        const u = TABLES.USERS;

        let sql = `SELECT * FROM ${p} WHERE ${p}.id = ${post_id};\
                SELECT id, email, username, avatar_url, description FROM ${u} WHERE ${u}.id = (\
                    SELECT author_id FROM ${p} WHERE ${p}.id = ${post_id})`;
        return await dbConnection.query(sql);
    }


    async getFeaturedAuthorsTop3() {
        const p = this.tableName;
        const u = TABLES.USERS;
        const pl = TABLES.POST_LIKES;

        let sql = `SELECT ${u}.id, ${u}.username, ${u}.avatar_url, ${u}.description, \
                        COUNT(${p}.id) AS sum_posts,\
                        (SELECT COUNT(${pl}.id) FROM ${pl} WHERE ${p}.id = ${pl}.post_id)\
                            AS sum_likes\
                    FROM ${p} INNER JOIN ${u} ON ${u}.id = ${p}.author_id\
                    GROUP BY ${p}.author_id\
                    ORDER BY sum_likes DESC, sum_posts DESC LIMIT 3;`
        return await dbConnection.query(sql);
    }

    async getHotPosts() {
        const p = this.tableName;
        const pl = TABLES.POST_LIKES;
        const pc = TABLES.POST_COMMENTS;

        let sql = `SELECT id, author_id, title, content, background_url, created_at,\
                        (SELECT COUNT(*) FROM ${pl} WHERE post_id=${p}.id) likes,\
                        (SELECT COUNT(*) FROM ${pc} WHERE post_id=${p}.id) comments\
                    FROM ${p}\
                    ORDER BY likes DESC, comments DESC LIMIT 12`;
        return await dbConnection.query(sql);
    }
}

module.exports = new Posts(TABLES.POSTS)