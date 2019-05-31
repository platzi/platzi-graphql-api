const authors = require("./authors.json");
const books = require("./books.json");

const debug = (...params) => console.log(params);

module.exports.getBooks = async () => {
  debug("getBooks");
  return books;
};
module.exports.getBook = async id => {
  return books.find(b => b.id === id);
};
module.exports.getAuthors = async () => {
  return authors;
};
module.exports.getAuthor = async id => {
  debug("getAuthor", id);
  return authors.find(a => a.id === id);
};
module.exports.likeBook = async id => {
  const book = books.find(b => b.id === id);
  if (!book) {
    return false;
  }
  book.likes += 1;
  return true;
};
module.exports.getManyAuthors = async ids => {
  debug("getManyAuthors", ids);
  const dbAuthors = authors.filter(a => ids.includes(a.id));
  return ids.map(id => dbAuthors.find(s => s.id == id));
};
module.exports.getUserByToken = async token => {
  if (token === "luis") {
    return "Luís";
  }
  return null;
};
