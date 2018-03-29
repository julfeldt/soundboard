import { words, play, stopSound } from "./sound";

const isTouchDevice = "ontouchstart" in document.documentElement;
var sentences = document.querySelector("#sentence");

let shouldPlay = false;

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

        if ($(".item", "#sentence").length < 12) {
            sentences.innerHTML += "<div class='item added' data-word='" + id + "'>" + obj.innerText + "</div>";
            // Make it removable
            $(".added").on("click", (e) => {
                $(e.target).remove();
            });
        } else {
            console.log("no more words!");
            // TODO: say der er for mange ord!
        }
    }
});

const playButton = $("#play-button");


// Play the whole setence
playButton.on("click", (e) => {

    // TBD - Understand this fully
    // Handle errors

    playButton.prop('disabled', true);

    (async() => {
        shouldPlay = true;
        const words = $(".item", "#sentence");
        for (var i = 0; i < words.length; i++) {
            const word = words[i];
            // previous
            let prev = i > 0 ? i - 1 : 0;
            words[prev].style.opacity = 1;
            // current
            words[i].style.opacity = 0.5;
            await playWordWithPromise($(word).data("word"));
            if (i == words.length - 1) {
                words[i].style.opacity = 1;
            }
        }
        playButton.prop('disabled', false);
    })();

    function playWordWithPromise(id) {
        return new Promise((resolve, reject) => {
            if (shouldPlay) {
                playWord(id, resolve, reject);
            }
        });
    }
});

$("#clear-button").on("click", (e) => {
    stopSound(true);
    shouldPlay = false;
    $(sentences).empty();
    playButton.prop('disabled', false);
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