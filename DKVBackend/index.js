/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/
'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.056e41c7-9cf9-4354-88b8-120295de3d86';

const languageStrings = {
    'en-GB': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
                'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
                'Venus rotates anti-clockwise, possibly because of a collision in the past with an asteroid.',
                'On Mars, the Sun appears about half the size as it does on Earth.',
                'Earth is the only planet not named after a god.',
                'Jupiter has the shortest day of all the planets.',
                'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
                'The Sun contains 99.86% of the mass in the Solar System.',
                'The Sun is an almost perfect sphere.',
                'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
                'Saturn radiates two and a half times more energy into space than it receives from the sun.',
                'The temperature inside the Sun can reach 15 million degrees Celsius.',
                'The Moon is moving approximately 3.8 cm away from our planet every year.',
            ],
            SKILL_NAME: 'British Space Facts',
            GET_FACT_MESSAGE: "Here's your fact: ",
            HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            ZODIAC_DATE: 'The zodiac ',
        },
    },
    'en-US': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
                'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
                'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
                'On Mars, the Sun appears about half the size as it does on Earth.',
                'Earth is the only planet not named after a god.',
                'Jupiter has the shortest day of all the planets.',
                'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
                'The Sun contains 99.86% of the mass in the Solar System.',
                'The Sun is an almost perfect sphere.',
                'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
                'Saturn radiates two and a half times more energy into space than it receives from the sun.',
                'The temperature inside the Sun can reach 15 million degrees Celsius.',
                'The Moon is moving approximately 3.8 cm away from our planet every year.',
            ],
            SKILL_NAME: 'American Space Facts',
            GET_FACT_MESSAGE: "Here's your fact: ",
            HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
    'de-DE': {
        translation: {
            FACTS: [
                'Ein Jahr dauert auf dem Merkur nur 88 Tage.',
                'Die Venus ist zwar weiter von der Sonne entfernt, hat aber höhere Temperaturen als Merkur.',
                'Venus dreht sich entgegen dem Uhrzeigersinn, möglicherweise aufgrund eines früheren Zusammenstoßes mit einem Asteroiden.',
                'Auf dem Mars erscheint die Sonne nur halb so groß wie auf der Erde.',
                'Die Erde ist der einzige Planet, der nicht nach einem Gott benannt ist.',
                'Jupiter hat den kürzesten Tag aller Planeten.',
                'Die Milchstraßengalaxis wird in etwa 5 Milliarden Jahren mit der Andromeda-Galaxis zusammenstoßen.',
                'Die Sonne macht rund 99,86 % der Masse im Sonnensystem aus.',
                'Die Sonne ist eine fast perfekte Kugel.',
                'Eine Sonnenfinsternis kann alle ein bis zwei Jahre eintreten. Sie ist daher ein seltenes Ereignis.',
                'Der Saturn strahlt zweieinhalb mal mehr Energie in den Weltraum aus als er von der Sonne erhält.',
                'Die Temperatur in der Sonne kann 15 Millionen Grad Celsius erreichen.',
                'Der Mond entfernt sich von unserem Planeten etwa 3,8 cm pro Jahr.',
            ],
            SKILL_NAME: 'Weltraumwissen auf Deutsch',
            GET_FACT_MESSAGE: 'Hier sind deine Fakten: ',
            HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
        },
    },
};

const zodiacStartDates = {
    'aquarius': 'January 21st', 
    'pisces': 'February 20th',
    'aries': 'March 21st', 
    'taurus': 'April 21st', 
    'gemini': 'May 22nd', 
    'cancer': 'June 22nd', 
    'leo': 'July 23rd', 
    'virgo': 'August 23rd', 
    'libra': 'September 24th', 
    'scorpio': 'October 24th', 
    'sagittarius': 'November 23rd', 
    'capricorn': 'December 22nd' 
};

const datesOfZodiac = {
    '01-20': 'Capricorn', 
    '02-19': 'Aquarius', 
    '03-20': 'Pisces', 
    '04-20': 'Aries', 
    '05-21': 'Taurus', 
    '06-21': 'Gemini', 
    '07-22': 'Cancer', 
    '08-22': 'Leo', 
    '09-23': 'Virgo', 
    '10-23': 'Libra', 
    '11-22': 'Scorpio', 
    '12-21': 'Sagittarius', 
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFactIntent');
    },
    'ZodiacIntent' : function () {
        var zodiac = this.event.request.intent.slots.sign.value;
        var birth = this.event.request.intent.slots.birthDate.value;
        if (zodiac) {
            var zodiacDate = zodiacStartDates[zodiac.toLowerCase()];
            console.log('zodic request: ' + zodiac.toLowerCase() + '; DB entry: ' + zodiacDate);
            var speechout = "The zodiac " + zodiac + " starts at " + zodiacDate;
            this.emit(':tell', speechout);
        } else if (birth) {
            var eventDate = getDateFromSlot(birth);

            // Check we have both a start and end date
            if (eventDate.startDate && eventDate.endDate) {
                var zodiacForDate = 'Capricorn';
                console.log('EventDate: ' + eventDate.startDate);
                var month = new Date(eventDate.startDate).getMonth() + 1;
                var day = new Date(eventDate.startDate).getDate();
                console.log('Month-Day: ' + month + "-" + day);
                for (var key in datesOfZodiac) {
                    var parts = key.split('-');
                    var zMonth = parseInt(parts[0]);
                    var zDay = parseInt(parts[1]);
                    console.log('Zodiac Month-Day: ' + zMonth + "-" + zDay);
                    if (month < zMonth || (month == zMonth && day < zDay)) {
                        zodiacForDate = datesOfZodiac[key];
                        console.log('Zodiac found: ' + zodiacForDate);
                        break;
                    }
                }
                this.emit(':tell', 'The zodiac for ' + birth + ' is ' + zodiacForDate);
            } else {
                this.emit(':tell', 'something went wrong; the date ' + birth + ' could not be identified');
            }
        } else {
            this.emit(':tell', 'i need a date or zodiac to tell you more');
        }
    },
    'GetNewFactIntent': function () {
        this.emit('GetFactIntent');
    },
    'GetFactIntent': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        const factArr = this.t('FACTS');
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];

        // Create speech output
        const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
        this.emit(':tell', speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

// Given an AMAZON.DATE slot value parse out to usable JavaScript Date object
// Utterances that map to the weekend for a specific week (such as 'this weekend') convert to a date indicating the week number and weekend: 2015-W49-WE.
// Utterances that map to a month, but not a specific day (such as 'next month', or 'December') convert to a date with just the year and month: 2015-12.
// Utterances that map to a year (such as 'next year') convert to a date containing just the year: 2016.
// Utterances that map to a decade convert to a date indicating the decade: 201X.
// Utterances that map to a season (such as 'next winter') convert to a date with the year and a season indicator: winter: WI, spring: SP, summer: SU, fall: FA)
const DATE_OUT_OF_RANGE = "Date is out of range please choose another date";

function getDateFromSlot(rawDate) {
    // try to parse data
    var date = new Date(Date.parse(rawDate));
    var result;
    // create an empty object to use later
    var eventDate = {
        startDate: null,
        endDate: null,
        error: null
    };

    // if could not parse data must be one of the other formats
    if (isNaN(date)) {
        // to find out what type of date this is, we can split it and count how many parts we have see comments above.
        var res = rawDate.split("-");
        // if we have 2 bits that include a 'W' week number
        if (res.length === 2 && res[1].indexOf('W') > -1) {
            var weekDate = getWeekData(res);
            eventDate.startDate = new Date(weekDate.startDate);
            eventDate.endDate = new Date(weekDate.endDate);
            // if we have 3 bits, we could either have a valid date (which would have parsed already) or a weekend
        } else if (res.length === 3) {
            var weekend = getWeekendData(res);
            eventDate.startDate = new Date(weekend.startDate);
            eventDate.endDate = new Date(weekend.endDate);
            // anything else would be out of range for this skill
        } else {
            eventDate.error = DATE_OUT_OF_RANGE;
        }
        // original slot value was parsed correctly
    } else {
        eventDate.startDate = new Date(date).setUTCHours(0, 0, 0, 0);
        eventDate.endDate = new Date(date).setUTCHours(24, 0, 0, 0);
    }
    return eventDate;
}

// Given a week number return the dates for both weekend days
function getWeekendData(res) {
    if (res.length === 3) {
        var saturdayIndex = 5;
        var sundayIndex = 6;
        var weekNumber = res[1].substring(1);

        var weekStart = w2date(res[0], weekNumber, saturdayIndex);
        var weekEnd = w2date(res[0], weekNumber, sundayIndex);

        return {
            startDate: weekStart,
            endDate: weekEnd,
        };
    }
}

// Given a week number return the dates for both the start date and the end date
function getWeekData(res) {
    if (res.length === 2) {

        var mondayIndex = 0;
        var sundayIndex = 6;

        var weekNumber = res[1].substring(1);

        var weekStart = w2date(res[0], weekNumber, mondayIndex);
        var weekEnd = w2date(res[0], weekNumber, sundayIndex);

        return {
            startDate: weekStart,
            endDate: weekEnd,
        };
    }
}

// Used to work out the dates given week numbers
var w2date = function (year, wn, dayNb) {
    var day = 86400000;

    var j10 = new Date(year, 0, 10, 12, 0, 0),
        j4 = new Date(year, 0, 4, 12, 0, 0),
        mon1 = j4.getTime() - j10.getDay() * day;
    return new Date(mon1 + ((wn - 1) * 7 + dayNb) * day);
};

// Loops though the events from the iCal data, and checks which ones are between our start data and out end date
function getEventsBeweenDates(startDate, endDate, eventList) {

    var start = new Date(startDate);
    var end = new Date(endDate);

    var data = [];

    for (var i = 0; i < eventList.length; i++) {
        if (start <= eventList[i].start && end >= eventList[i].start) {
            data.push(eventList[i]);
        }
    }

    console.log("FOUND " + data.length + " events between those times");
    return data;
}

