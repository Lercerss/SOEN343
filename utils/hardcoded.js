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
        isbn13: '978-1524796976'
    }, {
        mediaType: 'Magazine',
        title: 'TIME',
        publisher: 'Time (May 13 2008)',
        publicationDate: date,
        language: 'English',
        isbn10: '1603200185',
        isbn13: '978-1603200189'
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
        runTime: 127
    }, {
        mediaType: 'Music',
        title: 'Anastasis',
        artist: 'Dead Can Dance',
        label: 'Sony Music',
        releaseDate: date,
        asin: 'B008FOB124'
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
        isbn13: '548-1234567890'
    }, {
        mediaType: 'Magazine',
        title: 'SOEN 343',
        publisher: 'Stack Ove',
        publicationDate: date,
        language: 'English',
        isbn10: '7894561234',
        isbn13: '987-9876543215'
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
        runTime: 145
    }, {
        mediaType: 'Music',
        title: 'WYD',
        artist: 'Alvyn',
        label: 'Das Ma Jam',
        releaseDate: date,
        type: 'CD',
        asin: 'E238G6Q654'
    }]
};

export function catalogQueryBuilder(type){
    var values = [];

    if (type === 'Book'){
        let dict = mediaData.initial[0];
        let valuesArr = [
            1,
            dict.title,
            dict.language,
            dict.isbn10,
            dict.isbn13,
            dict.publisher,
            dict.publicationDate,
            dict.author,
            dict.format,
            dict.pages
        ];
        values.push(valuesArr);
        return values;
    } else if (type === 'Magazine'){
        let dict = mediaData.initial[1];
        let valuesArr = [
            1,
            dict.title,
            dict.language,
            dict.isbn10,
            dict.isbn13,
            dict.publisher,
            dict.publicationDate,
        ];
        values.push(valuesArr);
        return values;
    } else if (type === 'Music'){
        let dict = mediaData.initial[3];
        let valuesArr = [
            1,
            dict.title,
            dict.releaseDate,
            dict.type,
            dict.artist,
            dict.label,
            dict.asin
        ];
        values.push(valuesArr);
        return values;
    } else if (type === 'Movie'){
        let dict = mediaData.initial[2];
        let valuesArr = [
            1,
            dict.title,
            dict.releaseDate,
            dict.director,
            dict.producers,
            dict.actors,
            dict.language,
            dict.subtitles,
            dict.dubbed,
            dict.runTime
        ];
        values.push(valuesArr);
        return values;
    }
}
