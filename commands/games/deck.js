class Deck {
    constructor() {
        this.deck = [];
        this.reset();
    }

    reset() {
        this.deck = [];
        const cards = ['ace♣', 'ace♦', 'ace♥', 'ace♠', 
                       '2♣', '2♦', '2♥', '2♠',
                       '3♣', '3♦', '3♥', '3♠',
                       '4♣', '4♦', '4♥', '4♠',
                       '5♣', '5♦', '5♥', '5♠',
                       '6♣', '6♦', '6♥', '6♠',
                       '7♣', '7♦', '7♥', '7♠',
                       '8♣', '8♦', '8♥', '8♠',
                       '9♣', '9♦', '9♥', '9♠',
                       'ten♣', 'ten♦', 'ten♥', 'ten♠',
                       'j♣', 'j♦', 'j♥', 'j♠',
                       'q♣', 'q♦', 'q♥', 'q♠',
                       'k♣', 'k♦', 'k♥', 'k♠'];

        for (let card in cards) {
            this.deck.push(`${cards[card]}`);
        }
    }

    shuffle() {
        const { deck } = this;
        let x = deck.length, i;
        while (x) {
            i = Math.floor(Math.random() * x--);
            [deck[x], deck[i]] = [deck[i], deck[x]]
        }
        return this;
    }

    deal() {
        return this.deck.pop();
    }

}
let cardDeck = new Deck();

exports.deal = function(){
    return cardDeck.deal();
}

exports.shuffle = function(){
    return cardDeck.shuffle();
}

exports.newDeck = function(userid){
    return new Deck();
}