exports.errorHandler = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "page not found",
      currentPage: "404",
      isLoggedIn: req.isLoggedIn,
    });
};
