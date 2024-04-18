//==================================================3rd code

const Hapi = require('@hapi/hapi');






const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register({
        plugin: require('hapi-mongodb'),
        options: {
        //   url: 'mongodb+srv://{YOUR-USERNAME}:{YOUR-PASSWORD}@main.zxsxp.mongodb.net/sample_mflix?retryWrites=true&w=majority',
          url: 'mongodb://127.0.0.1:27017/hapidb',  //  'mongodb+srv://{YOUR-USERNAME}:{YOUR-PASSWORD}@main.zxsxp.mongodb.net/sample_mflix?retryWrites=true&w=majority',
          settings: {
              useUnifiedTopology: true
          },
          decorate: true
        }
    });

    // Add this below the @hapi/hapi require statement
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

    // // Get a single movies
    // server.route({
    //     method: 'GET',
    //     path: '/movie',
    //     handler: async(req, h) => {
    //         console.log("movie>>> ","req", h);
    //         const db = req.mongo.db;
    //         const ObjectID = req.mongo.ObjectID;
    //         try {
    //             // const result = await db.collection('movies').findOne({  _id: new ObjectID(request.params.id) });
    //             const result = await db.collection('movies').findOne({});
    //             return result;
    //         }
    //         catch (err) {
    //             console.log("err", err);
    //             // throw Boom.internal('Internal MongoDB error', err);
    //             throw new Error ('Internal MongoDB error', err)
    //             // Boom.internal('Internal MongoDB error', err);
    //         }

    //     // const movie = await req.mongo.db.collection('movies').findOne({})
    //     // return movie;
    //     // return 'a single movie';
    //     }
    // });



  // Get all movies
  server.route({
    method: 'GET',
    path: '/movies',
    handler: async(req, h) => {
        // const db = req.mongo.db;
        // const ObjectID = req.mongo.ObjectID;

        try {
            console.log("movies>>> ","req", "h");
        const movies = await req.mongo.db.collection('movies').find({}).toArray();
        return movies;

            // const offset = Number(req.query.offset) || 0;
            // const movies = await req.mongo.db.collection('movies').find({}).sort({metacritic:-1}).skip(offset).limit(20).toArray();
            // return movies;
        }
        catch (err) {
            console.log("err", err);
            // throw Boom.internal('Internal MongoDB error', err);
            throw new Error ('Internal MongoDB error', err)
            // Boom.internal('Internal MongoDB error', err);
        }
    }
});


  

    // Add a new movie to the database
    server.route({
        method: 'POST',
        path: '/movies',
        handler: async(req, h) => {
            const payload = req.payload
            console.log("???????>>>>>>>> ",req.payload);
            const status = await req.mongo.db.collection('movies').insertOne(payload);
            return status;
            // return 'Add new movie';
        }
    });

    // Get a single movie
    server.route({
        method: 'GET',
        path: '/movies/{id}',
        handler: async (req, h) => {
            const id = req.params.id
            const ObjectID = req.mongo.ObjectID;
            const movie = await req.mongo.db.collection('movies').findOne({_id: new ObjectID(id)},{projection:{title:1,plot:1,cast:1,year:1, released:1}});
            return movie;
        }
    });

    // Update the details of a movie
    server.route({
        method: 'PUT',
        path: '/movies/{id}',
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.objectId()
                })
            }
        },
        handler: async(req, h) => {
            const id = req.params.id
            const ObjectID = req.mongo.ObjectID;
            const payload = req.payload
            console.log(id, "ObjectID", payload);
            try{
                const status = await req.mongo.db.collection('movies').updateOne({_id: new ObjectID(id)}, {$set: payload});
                console.log("status", status);
                return status;
            }catch(e){
                console.log(id, "e", e);
            }

          

            // return 'Update a single movie';
        }
    });

    // Delete a movie from the database
    server.route({
        method: 'DELETE',
        path: '/movies/{id}',
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.objectId()
                })
            }
        },
        handler: async (req, h) => {
            const id = req.params.id
            const ObjectID = req.mongo.ObjectID;
    
            const payload = req.payload
    
            const status = await req.mongo.db.collection('movies').deleteOne({_id: new ObjectID(id)});
    
            return status;
    
        }
    });

    // Search for a movie
    server.route({
        method: 'GET',
        path: '/search',
        handler: async(req, h) => {

            try {
                const query = req.query.term;
                console.log(req.query.term, "****");
                const results = await req.mongo.db.collection("movies").aggregate([
                    {
                        $search: {
                            "search": {
                                "query": query,
                                "path":"title"
                            }
                        }
                    },
                    {
                        $project : {title:1, plot: 1}
                    },
                    {  
                        $limit: 10
                    }
                    ]).toArray()
        
                return results;
                
            } catch (error) {
                console.log("error", error);
            }

           
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

init();  









//================================================1st code
// const Hapi = require('@hapi/hapi');

// const server = Hapi.server({
//     port: 3000,
//     host: 'localhost'
// });

// server.route({
//     method: 'GET',
//     path: '/',
//     handler: (req, h) => {

//         return 'Hello from HapiJS!';
//     }
// });

// server.start();
// console.log('Server running on %s', server.info.uri);

//=====================================================2nd code
// const Hapi = require('@hapi/hapi');

// const server = Hapi.server({
//     port: 3000,
//     host: 'localhost'
// });

// // Get all movies
// server.route({
//     method: 'GET',
//     path: '/movies',
//     handler: (req, h) => {

//         return 'List all the movies';
//     }
// });

// // Add a new movie to the database
// server.route({
//     method: 'POST',
//     path: '/movies',
//     handler: (req, h) => {

//         return 'Add new movie';
//     }
// });

// // Get a single movie
// server.route({
//     method: 'GET',
//     path: '/movies/{id}',
//     handler: (req, h) => {

//         return 'Return a single movie';
//     }
// });

// // Update the details of a movie
// server.route({
//     method: 'PUT',
//     path: '/movies/{id}',
//     handler: (req, h) => {

//         return 'Update a single movie';
//     }
// });

// // Delete a movie from the database
// server.route({
//     method: 'DELETE',
//     path: '/movies/{id}',
//     handler: (req, h) => {

//         return 'Delete a single movie';
//     }
// });

// // Search for a movie
// server.route({
//     method: 'GET',
//     path: '/search',
//     handler: (req, h) => {

//         return 'Return search results for the specified term';
//     }
// });

// server.start();
// console.log('Server running on %s', server.info.uri);