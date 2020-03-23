const { forwardTo } = require('prisma-binding');
const { APP_SECRET, getUserId } = require('../utils')
const Query = {
  placements:forwardTo('db'),
  placement:forwardTo('db')
 };
 
 module.exports = Query;
 