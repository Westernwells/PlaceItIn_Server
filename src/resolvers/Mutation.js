const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')
const mutations = {
  async signup(parent, args,ctx,info){

// lowercase their email
args.email = args.email.toLowerCase();
// hash their password
const password = await bcrypt.hash(args.password, 10);
const isProfile = false;
// create the user in the database
console.log(password);
const user = await ctx.db.mutation.createUser(
  {    
     data:{
         ...args,
         password,
         isProfile
        } 
    }
);
// create the JWT token for them
console.log(user)
const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

// Finalllllly we return the user to the browser
return {token,user};

   },
async signin(parent, args, ctx, info) {
    // 1
    const user = await ctx.db.query.user({where:{email: args.email}});
    
    console.log(user);
    if (!user) {
      throw new Error('No such user found')
    }
  
    // 2
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }
  
const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  
    // 3
    return {
      token,
      user,
    }
  },

  async createPlacement(parent,args,ctx,info){
const userId = getUserId(ctx);
console.log(ctx);
if(!userId) {
    throw new Error('sorry you are not permitted to create a placements post');
}
const placement = await ctx.db.mutation.createPlacement({

    data:{
        user:{
            connect:{
                id:userId
            },
        },
        ...args
    },
},
info);
return placement;
  },

//   async createPlacement(parent, args, ctx, info) {

//     if (!ctx.request.userId) {
//       throw new Error('You must be logged in to do that!');
//     }

//     const item = await ctx.db.mutation.createItem(
//       {
//         data: {
//           // This is how to create a relationship between the Item and the User
//           user: {
//             connect: {
//               id: ctx.request.userId,
//             },
//           },
//           ...args,
//         },
//       },
//       info
//     );

//     console.log(item);

//     return item;
//   },
  
}

module.exports = mutations;
