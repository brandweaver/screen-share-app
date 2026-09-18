const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


// Serve your HTML files
app.use(express.static(path.join(__dirname, "public")));


// ---------------------------------------------------------
// SOCKET CONNECTION
// ---------------------------------------------------------

io.on("connection", socket => {

    console.log(
        "Client connected:",
        socket.id
    );


    // -----------------------------------------------------
    // HOST READY
    // -----------------------------------------------------

    socket.on("host-ready", () => {

        console.log(
            "Host ready:",
            socket.id
        );

        socket.join("screen-share");

    });


    // -----------------------------------------------------
    // VIEWER READY
    // -----------------------------------------------------

    socket.on("viewer-ready", () => {

        console.log(
            "Viewer ready:",
            socket.id
        );

        socket.join("screen-share");


        /*
         * Tell everyone else in the room that a viewer
         * is ready.
         *
         * The host will receive this.
         */

        socket.to("screen-share").emit(
            "viewer-ready"
        );

    });


    // -----------------------------------------------------
    // OFFER
    // -----------------------------------------------------

    socket.on("offer", offer => {

        console.log(
            "Offer received from:",
            socket.id
        );


        socket.to("screen-share").emit(
            "offer",
            offer
        );

    });


    // -----------------------------------------------------
    // ANSWER
    // -----------------------------------------------------

    socket.on("answer", answer => {

        console.log(
            "Answer received from:",
            socket.id
        );


        socket.to("screen-share").emit(
            "answer",
            answer
        );

    });


    // -----------------------------------------------------
    // ICE CANDIDATE
    // -----------------------------------------------------

    socket.on("ice-candidate", data => {

        socket.to("screen-share").emit(
            "ice-candidate",
            data
        );

    });


    // -----------------------------------------------------
    // DISCONNECT
    // -----------------------------------------------------

    socket.on("disconnect", () => {

        console.log(
            "Client disconnected:",
            socket.id
        );

    });

});


// ---------------------------------------------------------
// START SERVER
// ---------------------------------------------------------

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(
        `Screen share server running on port ${PORT}`
    );

});