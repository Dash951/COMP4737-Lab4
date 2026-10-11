const messages = require("../lang/en/en");

class Utils {
  getDate(name) {
    // Swaps the placeholder with the name
    const text = messages.greeting.replace("%placeholder", name);
    const now = new Date().toString();
    return '<p style="color: blue;">' + text + now + "</p>";
  }
}

module.exports = Utils;