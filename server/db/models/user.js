const mongoose = require(`mongoose`);
const GeoJSON = require(`mongoose-geojson-schema`);

const { Schema } = mongoose;

const schema = new Schema({
    displayName: String,
    gender: String,
    message: String,
    profilePictureUrl: String,
    position: Schema.Types.Point
});

schema.index({ position: `2dsphere` });

module.exports = mongoose.model(`User`, schema);