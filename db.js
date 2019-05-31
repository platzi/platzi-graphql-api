const authors = require("./authors.json");
const books = require("./books.json");

module.exports.getBooks = async () => {
  return books;
};
module.exports.getBook = async id => {
  return books.find(b => b.id === id);
};
module.exports.getAuthors = async () => {
  return authors;
};
module.exports.getAuthor = async id => {
  return authors.find(a => a.id === id);
};
module.exports.likeBook = async id => {
  const book = await getBook(id);
  if (!book) {
    return false;
  }
  book.likes += 1;
  return true;
};
