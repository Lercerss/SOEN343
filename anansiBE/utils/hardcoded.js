import moment from 'moment';

var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

export const mediaData = {
    initial: [{
        mediaType: 'Book',
        title: 'Do Androids Dream of Electric Sheep?',
        author: 'Philip K. Dick',
        format: 'Paperback',
        pages: 240,
        publisher: 'Del Rey; Reprint edition (Sept. 26 2017)',
        publicationDate: date,
        language: 'English',
        isbn10: '1524796972',
        isbn13: '978-1524796976',
        copies: []
    }, {
        mediaType: 'Magazine',
        title: 'TIME',
        publisher: 'Time (May 13 2008)',
        publicationDate: date,
        language: 'English',
        isbn10: '1603200185',
        isbn13: '978-1603200189',
        copies: []
    }, {
        mediaType: 'Movie',
        title: 'Until the End of the World',
        director: 'Wim Wenders',
        producers: 'Anatole Dauman, Ingrid Windisch, Joachim von Mengershausen, Pascale Daum.',
        actors: 'Bruno Ganz, Solveig Dommartin, Otto Sander, Curt Bois, Peter Falk',
        language: 'German',
        subtitles: 'English',
        dubbed: 'English, French',
        releaseDate: date,
        runtime: 127,
        copies: []
    }, {
        mediaType: 'Music',
        title: 'Anastasis',
        artist: 'Dead Can Dance',
        label: 'Sony Music',
        releaseDate: date,
        asin: 'B008FOB124'
    }, {
        mediaType: 'Book',
        title: 'The Hundred-Year-Old Man Who Climbed Out the Window and Disappeared',
        author: 'Jonas Jonasson',
        format: 'Paperback',
        pages: 400,
        publisher: 'HarperCollins; (Aug. 28 2012)',
        publicationDate: date,
        language: 'English',
        isbn10: '1443419109',
        isbn13: '978-1443419109',
        copies: []
    }],
    addAndEdit: [{
        mediaType: 'Book',
        title: 'Testing the limits',
        author: 'Alvyn Le',
        format: 'Hardcopy',
        pages: 69,
        publisher: 'Pub Ma Book',
        publicationDate: date,
        language: 'English',
        isbn10: '5478558965',
        isbn13: '548-1234567890',
        copies: [{ id: -1, name: 'Copy 1' }, { id: -2, name: 'Copy 2' }]
    }, {
        mediaType: 'Magazine',
        title: 'SOEN 343',
        publisher: 'Stack Ove',
        publicationDate: date,
        language: 'English',
        isbn10: '7894561234',
        isbn13: '987-9876543215',
        copies: [{ id: -1, name: 'Copy 1' }, { id: -2, name: 'Copy 2' }]
    }, {
        mediaType: 'Movie',
        title: 'Into darkness',
        director: 'Al Capone',
        producers: 'Some Dude',
        actors: 'John Doe, Foo Bar',
        language: 'Mandarin',
        subtitles: 'English',
        dubbed: 'English, French',
        releaseDate: date,
        runtime: 145,
        copies: [{ id: -1, name: 'Copy 1' }, { id: -2, name: 'Copy 2' }]
    }, {
        mediaType: 'Music',
        title: 'WYD',
        artist: 'Alvyn',
        label: 'Das Ma Jam',
        releaseDate: date,
        type: 'CD',
        asin: 'E238G6Q654',
        copies: [{ id: -1, name: 'Copy 1' }, { id: -2, name: 'Copy 2' }]
    }]
};

export function catalogQueryBuilder(type){
    var values = [];
    var countMedia = 1;
    const arr = mediaData.initial;

    if (type === 'Book') {
        arr.forEach(el => {
            if (el.mediaType === type){
                let valuesArr = [
                    countMedia,
                    el.title,
                    el.language,
                    el.isbn10,
                    el.isbn13,
                    el.publisher,
                    el.publicationDate,
                    el.author,
                    el.format,
                    el.pages
                ];
                values.push(valuesArr);
                countMedia++;
            }
        });
        return values;
    } else if (type === 'Magazine'){
        arr.forEach(el => {
            if (el.mediaType === type){
                let valuesArr = [
                    countMedia,
                    el.title,
                    el.language,
                    el.isbn10,
                    el.isbn13,
                    el.publisher,
                    el.publicationDate,
                ];
                values.push(valuesArr);
                countMedia++;
            }
        });
        return values;
    } else if (type === 'Music'){
        arr.forEach(el => {
            if (el.mediaType === type){
                let valuesArr = [
                    countMedia,
                    el.title,
                    el.releaseDate,
                    el.type,
                    el.artist,
                    el.label,
                    el.asin
                ];
                values.push(valuesArr);
                countMedia++;
            }
        });
        return values;
    } else if (type === 'Movie'){
        arr.forEach(el => {
            if (el.mediaType === type){
                let valuesArr = [
                    countMedia,
                    el.title,
                    el.releaseDate,
                    el.director,
                    el.producers,
                    el.actors,
                    el.language,
                    el.subtitles,
                    el.dubbed,
                    el.runtime
                ];
                values.push(valuesArr);
                countMedia++;
            }
        });
        return values;
    }
}
