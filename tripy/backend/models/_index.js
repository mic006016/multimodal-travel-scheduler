const Sequelize = require("sequelize")
const env = process.env.NODE_ENV || "development"
const config = require(__dirname + "/../config/config.js")[env]

const Users = require("./users")
const Trips = require("./trips")
const Photos = require("./photos")
const Posts = require("./posts")
const Emotions = require("./emotions")
const EmotionsTargets = require("./emotionstargets")
const Destinations = require("./destinations")
const Themes = require("./themes")
const PhotoCategoryMaps = require("./photoCategoryMaps")
const Categories = require("./categories")
const Bookmarks = require("./bookmarks")
const UserTrips = require("./usertrip")

const db = {}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
)

db.sequelize = sequelize

db.Users = Users
db.Trips = Trips
db.Photos = Photos
db.Posts = Posts
db.Emotions = Emotions
db.EmotionsTargets = EmotionsTargets
db.Destinations = Destinations
db.Themes = Themes
db.PhotoCategoryMaps = PhotoCategoryMaps
db.Categories = Categories
db.Bookmarks = Bookmarks
db.UserTrips = UserTrips

Users.init(sequelize)
Trips.init(sequelize)
Photos.init(sequelize)
Posts.init(sequelize)
Emotions.init(sequelize)
EmotionsTargets.init(sequelize)
Destinations.init(sequelize)
Themes.init(sequelize)
PhotoCategoryMaps.init(sequelize)
Categories.init(sequelize)
Bookmarks.init(sequelize)
UserTrips.init(sequelize)

Users.associate(db)
Trips.associate(db)
Photos.associate(db)
Posts.associate(db)
Emotions.associate(db)
EmotionsTargets.associate(db)
Destinations.associate(db)
Themes.associate(db)
PhotoCategoryMaps.associate(db)
Categories.associate(db)
Bookmarks.associate(db)
UserTrips.associate(db)

module.exports = db
