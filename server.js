const express = require('express')
const config = require('./config')
const url = require("url");
const app = express()
const fs = require("fs")
const os = require("os")
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const MemoryStore = require("memorystore")(session);
const cookieParser = require('cookie-parser');
const Handler = require('passport-handler').default
const referrerPolicy = require('referrer-policy');
app.use(referrerPolicy({ policy: "strict-origin" }))

module.exports = async (client) => {
    app.enable("trust proxy") // if ip is ::1 it means local
    app.set("etag", false); // disable cache

    app.use(express.static(__dirname + "/website"))
    app.set('views', path.join(__dirname, '/website/html'));
    const templateDir = path.resolve(`${process.cwd()}${path.sep}website`);
    app.use("/css", express.static(path.resolve(`${templateDir}${path.sep}website/assets/css`)));
    app.use("/js", express.static(path.resolve(`${templateDir}${path.sep}website/assets/js`)));
    app.use("/img", express.static(path.resolve(`${templateDir}${path.sep}website/assets/img`)));
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    passport.use(new Strategy({
        clientID: config.Bot.ClientID,
        clientSecret: config.Bot.ClientSecret,
        callbackURL: config.Website.callbackURL,
        scope: ['identify', 'guilds', 'email', 'guilds.join']
    },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
        }));

    app.use(require('express-session')({
        store: new MemoryStore({ checkPeriod: 432000000 }),
        secret: 'anshtyagi',
        resave: false,
        saveUninitialized: true
    }))


    app.use(passport.initialize());
    app.use(passport.session());

    app.engine("fuca", ejs.renderFile);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    const cors = require('cors')
    app.use(cors({ origin: ['http://localhost:3000'], credentials: true }))

    app.set("views", path.join(__dirname, "./website/html"))
    app.set("view engine", "ejs")


    global.checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login")
    }

    app.get('/login', (req, res, next) => {
        if (req?.query?.code) return res.redirect('/login')
        req.session.next = req.query.next || "/"

        req.session.save()
        next()
    }, passport.authenticate("discord", { prompt: "none" }))

    app.get('/callback', Handler(passport.authenticate('discord'), {
        error: (err, req, res, next) => {
            res.redirect('/login')
        },
        success: async (req, res, next) => {
            req.session.user = req.session.passport.user

            try {

                try {
                    axios({
                        url: `https://discordapp.com/api/v10/guilds/${config.servers.id}/members/${req.user.id}`,
                        method: "PUT",
                        data: {
                            access_token: req.user.accessToken,
                        },
                        headers: {
                            Authentication: `Bot ${config.Bot.ClientToken}`,
                            "Content-Type": `application/json`,
                        },
                    }).catch(() => { });
                } catch { }
                res.redirect(req.session.backURL || "/?login=true");

            } catch (err) {
                console.log(`${err.message}`)
                return res.redirect('/login')
            }
        }
    }))

    app.get("/logout", function (req, res) {
        req.session.destroy(() => {
            req.logout(function (err) {
                if (err) {
                    console.log(err);
                }
                res.redirect("/");
            });
        });
    });

    app.get('/404', (req, res) => {
        res.status(404).render("404.ejs", {
            code: 404,
            error: 'Oops! Page not found.',
            description: 'The page you are looking for might have been removed or its temporarily unavailable.'
        })
    })

    app.get('/500', (req, res) => {
        res.status(500).render("404.ejs", {
            code: '500',
            error: 'Discord channel not added.',
            description: 'First please add discord channel.'
        })
    })

    // const renderTemplate = (res, req, template, data = {}) => {
    //     const baseData = {
    //         bot: client,
    //         path: req.path,
    //         _token: req.session['_token'],
    //         user: req.isAuthenticated() ? req.user : null
    //     };
    //     res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    // };



    // dashboard

    // request handler
    // js handler
    // fs.readdirSync(directoryPath).forEach(file => {
    //     if (file.endsWith('.js')) {
    //         const filePath = path.join(directoryPath, file);
    //         const module = require(filePath);
    //         if (module && module.name) {
    //             app.get(module.name, module.run);
    //             console.log(`[Dashboard] - Loaded ${module.name}`);
    //         }
    //     }
    // });


    const http = require('http').createServer(app);
    const io = require('socket.io')(http);
    io.on('connection', socket => {
        io.emit("userCount", io.engine.clientsCount);
    });
    http.listen(10000, () => { console.log("[Fucabot]: Website running port 10000.") });

    //------------------- Routers -------------------//

    /* General */
    console.clear();
    /*
      (WARN)
      You can delete the log here, but you cannot write your own name in the Developed by section.
      * log = first console.log
    */
    console.log(`
      [===========================================]
                       Fuca
        
                Developed by ANSH

                    Achievements =)
      [===========================================]
      `)
    console.log("\x1b[32m", "System loading, please wait...")
    console.clear();
    app.use("/", require('./website/public/home.js'))
    app.use("/", require('./website/public/dashboard.js'))
    app.use("/", require('./website/public/transcript.js'))
    app.use("/guild", require('./website/public/guild.js'))
    app.use("/guild", require('./website/public/welcome.js'))
    app.use("/guild", require('./website/public/ticket.js'))
    app.use("/guild", require('./website/public/leave.js'))
    app.use("/guild", require('./website/public/youtube.js'))
    app.use((req, res) => {
        res.redirect('/404')
    });
}