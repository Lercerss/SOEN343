import { DatabaseManager } from './DatabaseManager';
import moment from 'moment';

const db = DatabaseManager.getConnection();

export class MediaGateway {
    static _upsertCopies(copiesTable, copies, copiesFK, itemId, callback) {
        const copiesQuery = db.format(
            `INSERT INTO ?? VALUES ? 
            ON DUPLICATE KEY UPDATE 
                id=VALUES(id),
                name=VALUES(name);`,
            [
                copiesTable,
                copies && copies.map(copy => [(copy.id >= 0 ? copy.id : null), itemId, copy.name, true]),
            ]
        );
        db.query(copiesQuery, err => {
            if (err) {
                callback(err);
                return;
            }
            db.query(`SELECT id, name FROM ${copiesTable} WHERE ${copiesFK}=${itemId}`, (err, rows) => {
                callback(err, rows);
            });
        });
    }

    static getLoans(user, callback) {
        // returns number of non-returned loans associated with the user
        const query = db.format('SELECT * FROM loans WHERE user_id = ? AND return_ts = null',
            [
                user
            ]
        );

        db.query(query, (err, rows) => {
            callback(err, rows);
        });
    }

    static addLoans(items, user, callback) {
        var bookLoans = [];
        var movieLoans = [];
        var musicLoans = [];
        var mediaItem;
        for (mediaItem in items) {
            if (mediaItem.mediaType === 'Book') {
                bookLoans.push(mediaItem.id);
            } else if (mediaItem.mediaType === 'Music') {
                musicLoans.push(mediaItem.id);
            } else if (mediaItem.mediaType === 'Movie') {
                movieLoans.push(mediaItem.id);
            }
        }
        this.addBookLoans(bookLoans, user, (err, bookIds) => {
            if (err) {
                callback(err);
                return;
            }
            this.addMovieLoans(movieLoans, user, (err, movieIds) => {
                if (err) {
                    callback(err);
                    return;
                }
                this.addMusicLoans(musicLoans, user, (err, musicIds) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    var now = moment();
                    var values = [];
                    for (var book in bookIds) {
                        values.push(['book', book, user, now.format('YYYY-MM-DD HH:mm:ss'), null, now.add(7, 'days').format('YYYY-MM-DD HH:mm:ss')]);
                    }
                    const query = db.format('INSERT INTO loans(item_type, copy_id, user_id, loan_ts, expectedReturn) VALUES ?',
                        [values]
                    );
                    db.query(query, (err) => {
                        if (err) {
                            callback(err);
                        }
                        values = [];
                        for (var movie in movieIds) {
                            values.push(['movie', movie, user, now.format('YYYY-MM-DD HH:mm:ss'), null, now.add(2, 'days').format('YYYY-MM-DD HH:mm:ss')]);
                        }
                        const query = db.format('INSERT INTO loans(item_type, copy_id, user_id, loan_ts, expectedReturn) VALUES ?',
                            [values]
                        );
                        db.query(query, (err) => {
                            if (err) {
                                callback(err);
                            }
                            values = [];
                            for (music in musicIds) {
                                values.push(['music', music, user, now.format('YYYY-MM-DD HH:mm:ss'), null, now.add(2, 'days').format('YYYY-MM-DD HH:mm:ss')]);
                            }
                            const query = db.format('INSERT INTO loans(item_type, copy_id, user_id, loan_ts, expectedReturn) VALUES ?',
                                [values]
                            );
                            db.query(query, (err, rows) => {
                                if (err) {
                                    callback(err);
                                }
                                callback(null, rows);
                            });
                        });
                    });
                });
            });
        });
    }

    static addBookLoans(items, user, callback) {
        const query = db.format('SELECT * FROM books_copies WHERE available = TRUE AND books_id IN(?)',
            [
                items
            ]
        );
        db.query(query, (err, rows) => {
            if (err) {
                callback(err);
                return;
            }
            if (rows === null || rows.length === 0) {
                callback(new Error('No copies available'));
                return;
            }
            // get only one copy of each book
            var bookCopyIds = [];
            for (var i = 0; i < items; i++) {
                if (items[i] === rows.books_id && (!bookCopyIds.includes(rows.id))) {
                    bookCopyIds.push(rows.id);
                }
            }
            if (bookCopyIds.length < items.length) {
                // there are less copies available than requestied
                callback(new Error('Not enough copies available'));
                return;
            }
            const updateQuery = db.format('UPDATE books_copies SET available = FALSE WHERE id = ?',
                [
                    bookCopyIds
                ]
            );
            db.query(updateQuery, (err, rows) => {
                if (err) {
                    callback(err);
                    return;
                }
                callback(err, bookCopyIds);
            });
        });
    }

    static addMovieLoans(items, user, callback) {
        const query = db.format('SELECT * FROM movies_copies WHERE available = TRUE AND movies_id IN(?)',
            [
                items
            ]
        );
        db.query(query, (err, rows) => {
            if (err) {
                callback(err);
                return;
            }
            if (rows === null || rows.length === 0) {
                callback(new Error('No copies available'));
                return;
            }
            // get only one copy of each movie
            var movieCopyIds = [];
            for (var i = 0; i < items; i++) {
                if (items[i] === rows.movies_id && (!movieCopyIds.includes(rows.id))) {
                    movieCopyIds.push(rows.id);
                }
            }
            if (movieCopyIds.length < items.length) {
                // there are less copies available than requestied
                callback(new Error('Not enough copies available'));
                return;
            }
            const updateQuery = db.format('UPDATE movies_copies SET available = FALSE WHERE id = ?',
                [
                    movieCopyIds
                ]
            );
            db.query(updateQuery, (err, rows) => {
                if (err) {
                    callback(err);
                    return;
                }
                callback(err, movieCopyIds);
            });
        });
    }

    static addMusicLoans(items, user, callback) {
        const query = db.format('SELECT * FROM music_copies WHERE available = TRUE AND music_id IN(?)',
            [
                items
            ]
        );
        db.query(query, (err, rows) => {
            if (err) {
                callback(err);
                return;
            }
            if (rows === null || rows.length === 0) {
                callback(new Error('No copies available'));
                return;
            }
            // get only one copy of each music item
            var musicCopyIds = [];
            for (var i = 0; i < items; i++) {
                if (items[i] === rows.music_id && (!musicCopyIds.includes(rows.id))) {
                    musicCopyIds.push(rows.id);
                }
            }
            if (musicCopyIds.length < items.length) {
                // there are less copies available than requestied
                callback(new Error('Not enough copies available'));
                return;
            }
            const updateQuery = db.format('UPDATE music_copies SET available = FALSE WHERE id = ?',
                [
                    musicCopyIds
                ]
            );
            db.query(updateQuery, (err, rows) => {
                if (err) {
                    callback(err);
                    return;
                }
                callback(err, musicCopyIds);
            });
        });
    }

    static saveMedia(type, fields, callback) {
        var query, copiesTable, copiesFK;
        if (type === 'Book') {
            query = db.format(
                'INSERT INTO books(title, author, format, pages, publisher, publicationDate, language, isbn10, isbn13) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    fields['title'],
                    fields['author'],
                    fields['format'],
                    fields['pages'],
                    fields['publisher'],
                    moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['language'],
                    fields['isbn10'],
                    fields['isbn13']
                ]
            );
            copiesTable = 'book_copies';
            copiesFK = 'book_id';
        } else if (type === 'Magazine') {
            query = db.format(
                'INSERT INTO magazines(title, publisher, publicationDate, language, isbn10, isbn13) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    fields['title'],
                    fields['publisher'],
                    moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['language'],
                    fields['isbn10'],
                    fields['isbn13']
                ]
            );
            copiesTable = 'magazine_copies';
            copiesFK = 'magazine_id';
        } else if (type === 'Music') {
            query = db.format(
                'INSERT INTO music(type, title, artist, label, releaseDate, asin) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    fields['type'],
                    fields['title'],
                    fields['artist'],
                    fields['label'],
                    moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['asin']
                ]
            );
            copiesTable = 'music_copies';
            copiesFK = 'music_id';
        } else if (type === 'Movie') {
            query = db.format(
                'INSERT INTO movies(title, director, producers, actors, language, subtitles, dubbed, releaseDate, runtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    fields['title'],
                    fields['director'],
                    fields['producers'],
                    fields['actors'],
                    fields['language'],
                    fields['subtitles'],
                    fields['dubbed'],
                    moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['runtime']
                ]
            );
            copiesTable = 'movie_copies';
            copiesFK = 'movie_id';
        } else {
            callback(new Error('Invalid Type'));
            return;
        }
        db.query(query, (err, rows) => {
            if (err || !fields.copies.length) {
                callback(err);
                return;
            }
            this._upsertCopies(copiesTable, fields.copies, copiesFK, rows.insertId, callback);
        });
    }

    static editMedia(type, id, fields, callback) {
        var query, copiesTable, copiesFK;
        if (type === 'Book') {
            query = db.format(
                'UPDATE books SET title = ?, language = ?, isbn10 = ?, isbn13 = ?, ' +
                    'publisher = ?, publicationDate = ?, author = ?, format = ?, pages = ? WHERE id = ?',
                [
                    fields['title'],
                    fields['language'],
                    fields['isbn10'],
                    fields['isbn13'],
                    fields['publisher'],
                    moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['author'],
                    fields['format'],
                    fields['pages'],
                    id
                ]
            );
            copiesTable = 'book_copies';
            copiesFK = 'book_id';
        } else if (type === 'Magazine') {
            query = db.format(
                'UPDATE magazines SET title = ?, language = ?, isbn10 = ?, isbn13 = ?, ' +
                    'publisher = ?, publicationDate = ? WHERE id = ?',
                [
                    fields['title'],
                    fields['language'],
                    fields['isbn10'],
                    fields['isbn13'],
                    fields['publisher'],
                    moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                    id
                ]
            );
            copiesTable = 'magazine_copies';
            copiesFK = 'magazine_id';
        } else if (type === 'Music') {
            query = db.format(
                'UPDATE music SET title = ?, releaseDate = ?, type = ?, artist = ?, label = ?, asin = ? WHERE id = ?',
                [
                    fields['title'],
                    moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['type'],
                    fields['artist'],
                    fields['label'],
                    fields['asin'],
                    id
                ]
            );
            copiesTable = 'music_copies';
            copiesFK = 'music_id';
        } else if (type === 'Movie') {
            query = db.format(
                'UPDATE movies SET title = ?, releaseDate = ?, director = ?, producers = ?, actors = ?,' +
                    'language = ?, subtitles = ?, dubbed = ?, runtime = ? WHERE id = ?',
                [
                    fields['title'],
                    moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['director'],
                    fields['producers'],
                    fields['actors'],
                    fields['language'],
                    fields['subtites'],
                    fields['dubbed'],
                    fields['runtime'],
                    id
                ]
            );
            copiesTable = 'movie_copies';
            copiesFK = 'movie_id';
        } else {
            callback(new Error('Invalid Type'));
            return;
        }
        db.query(query, err => {
            if (err) {
                callback(err);
                return;
            }
            const copies = fields.copies.filter(copy => copy.name);
            const deletedCopyIds = fields.copies.filter(copy => !copy.name).map(copy => copy.id);
            if (deletedCopyIds && deletedCopyIds.length) {
                const deleteCopiesQuery = db.format(
                    'DELETE FROM ?? WHERE id IN (?) AND ??=?',
                    [
                        copiesTable,
                        deletedCopyIds,
                        copiesFK,
                        id
                    ]);
                db.query(deleteCopiesQuery, err => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (copies && copies.length) {
                        this._upsertCopies(copiesTable, copies, copiesFK, id, callback);
                    } else {
                        callback(err);
                    }
                });
            } else if (copies && copies.length) {
                this._upsertCopies(copiesTable, copies, copiesFK, id, callback);
            } else {
                callback(err);
            }
        });
    }

    static findMediaById(type, id, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('SELECT * FROM books WHERE id = ?', id);
        } else if (type === 'Magazine') {
            query = db.format('SELECT * FROM magazines WHERE id = ?', id);
        } else if (type === 'Music') {
            query = db.format('SELECT * FROM music WHERE id = ?', id);
        } else if (type === 'Movie') {
            query = db.format('SELECT * FROM movies WHERE id = ?', id);
        }

        db.query(query, (err, rows, fields) => {
            callback(err, rows);
        });
    }

    static findMedia(type, fields, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('SELECT * FROM books WHERE isbn10 = ?', fields['isbn10']);
        } else if (type === 'Magazine') {
            query = db.format('SELECT * FROM magazines WHERE isbn10 = ?', fields['isbn10']);
        } else if (type === 'Music') {
            query = db.format('SELECT * FROM music WHERE asin = ?', fields['asin']);
        } else if (type === 'Movie') {
            query = db.format('SELECT * FROM movies WHERE title = ? AND releaseDate = ?', [
                fields['title'],
                fields['releaseDate']
            ]);
        }

        db.query(query, (err, rows, fields) => {
            callback(err, rows);
        });
    }

    static deleteMedia(type, id, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('DELETE FROM books WHERE id = ?', id);
        } else if (type === 'Magazine') {
            query = db.format('DELETE FROM magazines WHERE id = ?', id);
        } else if (type === 'Music') {
            query = db.format('DELETE FROM music WHERE id = ?', id);
        } else if (type === 'Movie') {
            query = db.format('DELETE FROM movies WHERE id = ?', id);
        }

        db.query(query, (err, rows, fields) => {
            callback(err);
        });
    }

    static getItems(filters, ordering, callback) {
        if (Object.keys(filters).length === 0){
            callback(new Error('No media type specified for viewing all items'));
            return;
        }

        if (!filters.mediaType) {
            var title = filters.fields.title ? ' WHERE title LIKE \'%' + filters.fields.title + '%\'' : '';
            var queryBook = `SELECT a.*,
                                CONCAT(
                                    '{',
                                    GROUP_CONCAT(CONCAT('"', b.id, '":"', b.name, '"') ORDER BY b.id DESC SEPARATOR ','),
                                    '}'
                                ) as copies
                                FROM books AS a
                                LEFT JOIN book_copies AS b ON a.id = b.book_id
                                ${ title } 
                                GROUP BY a.id;`;
            var queryMagazine = `SELECT a.*,
                                CONCAT(
                                    '{',
                                    GROUP_CONCAT(CONCAT('"', b.id, '":"', b.name, '"') ORDER BY b.id DESC SEPARATOR ','),
                                    '}'
                                ) as copies
                                FROM magazines AS a
                                LEFT JOIN magazine_copies AS b ON a.id = b.magazine_id
                                ${ title } 
                                GROUP BY a.id;`;
            var queryMusic = `SELECT a.*,
                                CONCAT(
                                    '{',
                                    GROUP_CONCAT(CONCAT('"', b.id, '":"', b.name, '"') ORDER BY b.id DESC SEPARATOR ','),
                                    '}'
                                ) as copies
                                FROM music AS a
                                LEFT JOIN music_copies AS b ON a.id = b.music_id
                                ${ title } 
                                GROUP BY a.id;`;
            var queryMovie = `SELECT a.*,
                                CONCAT(
                                    '{',
                                    GROUP_CONCAT(CONCAT('"', b.id, '":"', b.name, '"') ORDER BY b.id DESC SEPARATOR ','),
                                    '}'
                                ) as copies
                                FROM movies AS a
                                LEFT JOIN movie_copies AS b ON a.id = b.movie_id
                                ${ title } 
                                GROUP BY a.id;`;

            var books = [];
            var magazines = [];
            var music = [];
            var movies = [];
            var media = [];

            db.query(queryBook, function(err, rows, fields) {
                if (err) {
                    callback(new Error('Error querying database.'));
                    return;
                }
                var rawBooks = rows;
                books = rawBooks.map(function(el) {
                    var o = Object.assign({}, el);
                    o.mediaType = 'Book';
                    return o;
                });

                db.query(queryMagazine, function(err, rows, fields) {
                    if (err) {
                        callback(new Error('Error querying database.'));
                        return;
                    }
                    var rawMagazines = rows;
                    magazines = rawMagazines.map(function(el) {
                        var o = Object.assign({}, el);
                        o.mediaType = 'Magazine';
                        return o;
                    });

                    db.query(queryMusic, function(err, rows, fields) {
                        if (err) {
                            callback(new Error('Error querying database.'));
                            return;
                        }
                        var rawMusic = rows;
                        music = rawMusic.map(function(el) {
                            var o = Object.assign({}, el);
                            o.mediaType = 'Music';
                            return o;
                        });

                        db.query(queryMovie, function(err, rows, fields) {
                            if (err) {
                                callback(new Error('Error querying database.'));
                                return;
                            }
                            var rawMovies = rows;
                            movies = rawMovies.map(function(el) {
                                var o = Object.assign({}, el);
                                o.mediaType = 'Movie';
                                return o;
                            });

                            media = [].concat(books, magazines, music, movies);
                            media.sort((a, b) => {
                                var titleA = a.title.toUpperCase();
                                var titleB = b.title.toUpperCase();

                                let compare = 0;
                                if (Object.keys(ordering).length === 0) return -1;

                                if (titleA > titleB){
                                    if (ordering.title === 'ASC'){
                                        compare = 1;
                                    } else compare = -1;
                                } else if (titleA < titleB){
                                    if (ordering.title === 'ASC'){
                                        compare = -1;
                                    } else compare = 1;
                                }
                                return compare;
                            });
                            callback(err, media);
                        });
                    });
                });
            });
        } else {
            const mediaTable = 'a';
            var table, copyTable, type;
            switch (filters.mediaType) {
            case 'Book':
                table = 'books';
                copyTable = 'book_copies';
                type = 'book';
                break;
            case 'Magazine':
                table = 'magazines';
                copyTable = 'magazine_copies';
                type = 'magazine';
                break;
            case 'Movie':
                table = 'movies';
                copyTable = 'movie_copies';
                type = 'movie';
                break;
            case 'Music':
                table = 'music';
                copyTable = 'music_copies';
                type = 'music';
                break;
            }

            var filterClause, orderClause;
            if (Object.keys(filters.fields).length !== 0) {
                var fieldArray = [];
                Object.keys(filters.fields).forEach(function(key) {
                    fieldArray.push(`${ mediaTable }.` + key + " LIKE '%" + filters.fields[key] + "%'");
                });
                filterClause = fieldArray.join(' AND ');
            } else {
                filterClause = 'TRUE';
            }
            if (Object.keys(ordering).length !== 0) {
                orderClause = ' ORDER BY ';
                fieldArray = [];
                Object.keys(ordering).forEach(function(key) {
                    fieldArray.push(`${ mediaTable }.` + key + ' ' + ordering[key]);
                });
                orderClause = fieldArray.join(', ');
            } else {
                orderClause = ` ${ mediaTable }.id ASC`;
            }

            var query = `SELECT a.*,
                        CONCAT(
                            '{',
                            GROUP_CONCAT(CONCAT('"', b.id, '":"', b.name, '"') ORDER BY b.id DESC SEPARATOR ','),
                            '}'
                        ) as copies
                        FROM ${ table } AS a
                        LEFT JOIN ${ copyTable } AS b ON a.id = b.${ type }_id
                        WHERE ${ filterClause } 
                        GROUP BY a.id 
                        ORDER BY ${ orderClause };`;

            db.query(query, function(err, rows, fields) {
                console.log(query);
                if (err) {
                    console.log(err);
                    callback(new Error('Error querying database.'));
                    return;
                }

                let mediaRows = rows.map(function(el) {
                    var o = Object.assign({}, el);
                    o.mediaType = filters.mediaType;
                    return o;
                });

                callback(err, mediaRows);
            });
        }
    }
}
