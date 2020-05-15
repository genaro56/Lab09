const mongoose = require('mongoose');

/**
 * id: uuid.v4(),
	title: string,
	description: string,
	url: string,
	rating: number
 */
const bookmarksSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
});

const bookmarksCollection = mongoose.model('bookmarks', bookmarksSchema);

const Bookmarks = {
    createBookmark: function (newBookmark) {
        return bookmarksCollection
            .create(newBookmark)
                .then((res) => {
                    return res;
                })
                .catch((err) => { return err; })
    },
    getAllBookmarks: function () {
        return bookmarksCollection
            .find()
                .then((allBookmarks) => {
                    return allBookmarks;
                })
                .catch((err) => { return err; })
    },
    getBookmarkByTitle: function (title) {
        return bookmarksCollection
            .find({ title })
                .then((bookmarks) => {
                    return bookmarks;
                })
                .catch((err) => { return err; })
    },
    updateBookmark: function (id, data) {
        return bookmarksCollection
            .update({ id }, { $set : { ...data }})
                .then((bookmarks) => {
                    return bookmarks;
                })
                .catch((err) => { return err; })
    },
    deleteBookmark: function (id) {
        return bookmarksCollection
            .deleteOne({ id })
                .then((res) => {
                    console.log("bookmark deleted")
                    return res;
                })
                .catch((err) => { return err; })
    }
}

module.exports = { Bookmarks }

