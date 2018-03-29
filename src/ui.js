import { words, play, stopSound } from "./sound";

const isTouchDevice = "ontouchstart" in document.documentElement;
var sentences = document.querySelector("#sentence");

// Disable scrolling on touch devices
if (isTouchDevice) {
    document.addEventListener("touchmove", function(e) {
        e.preventDefault();
    });
}

// Add draggable words
for (var i = 0; i < words.length; i++) {
    $(".container").append("<div class='item noselect draggable' data-word='" + i + "'>" + words[i].word + "</div>");
}

$(".draggable").draggable({
    revert: true
});

// Handle when a word is dragged to the sentence box
$("#sentence").droppable({
    drop: (event, ui) => {
        var id = $(ui.draggable.context).data("word");
        var obj = ui.draggable.context;
        sentences.innerHTML += "<div class='item added' data-word='" + id + "'>" + obj.innerText + "</div>";
        obj.style.opacity = '0.5';

        // Make it removable
        $(".added").on("click", (e) => {
            $(e.target).remove();
        });
    }
});


// Play the whole setence
$("#play-button").on("click", (e) => {

    // TBD - Understand this fully
    // Handle errors

    console.log("Disable play button");
    (async() => {
        const words = $(".item", "#sentence")
        for (var i = 0; i < words.length; i++) {
            const word = words[i];
            await playWordWithPromise($(word).data("word"));
        }
        console.log("Enable play button");
    })();

    function playWordWithPromise(id) {
        return new Promise((resolve, reject) => {
            playWord(id, resolve, reject);
        });
    }
});

$("#clear-button").on("click", (e) => {
    $(sentences).empty();
});

// When playing sentence, show which word is the spoken one 


// Sample word
$(".item").on("click", (e) => {
    const id = $(e.target).data("word");
    playWord(id);
});

const playWord = (id, onEnd) => {
    play(words[id], onEnd);
}