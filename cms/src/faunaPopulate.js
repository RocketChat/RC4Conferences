const faunadb = require("faunadb");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = async () => {

  var client = new faunadb.Client({
    secret: process.env.FAUNA_DB_SECRET,
    domain: process.env.FAUNA_DB_DOMAIN,
    // NOTE: Use the correct domain for your database's Region Group.
    port: process.env.FAUNA_DB_PORT,
    scheme: process.env.NODE_ENV === "development" ? "http" : "https"
  });
  var q = faunadb.query;


  const headers = {
    Authorization: `Bearer ${process.env.FAUNA_DB_SECRET}`,
  };

  const file = path.resolve(__dirname, "../../assets/r0c4conf-schema.graphql");

    try {
      await axios.post(
        `https://${process.env.FAUNA_GRAPHQL_DOMAIN}:${process.env.FAUNA_DB_PORT}/import?mode=replace`,
        fs.createReadStream(file),
        {
          headers: headers,
        }
      );

      console.log("Schema successfully imported")

      const uquery = await client.query(
          q.Create(
              q.Ref(q.Collection('User'), '1'),
              {
                  data: {
                      uid: "1",
                      email: FAUNA_ADMIN_EMAIL,
                      displayName: "Evan.Shu",
                  },
                },
            )
        )

        console.log("created user", uquery)

        const evuser = await client.query(
            q.Create(
                q.Ref(q.Collection('EventUser'), '1'),
                {
                    data: {
                        uid: "1",
                        email: FAUNA_ADMIN_EMAIL,
                        displayName: "Evan.Shu",
                        user: q.Ref(q.Collection("User"), "1")
                    },
                    
                  },
              )
          )
          console.log("create event", evuser)
    } catch (e) {
      console.log("An error while initializing faunaDB", e);
    }

};
