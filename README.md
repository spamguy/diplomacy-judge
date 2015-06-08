# dipl.io Judge [![Build Status](https://travis-ci.org/spamguy/diplomacy-judge.svg?branch=master)](https://travis-ci.org/spamguy/diplomacy-judge)
A Diplomacy adjudicator written as a NodeJS module.

---

The dipl.io judge is a NodeJS module written to adjudicate [Diplomacy games][1]. Although written primarily for [dipl.io][2], it can be used in any NodeJS application that supplies data in an expected format.

The overall design is heavily influenced by the masterful [godip adjudicator][3]. In many senses, it can be considered a JavaScript adaptation.

The abstract theory is described in detail in Lucas Kruijswijk's article, ['The Math of Adjudication'][4].

[1]:http://en.wikipedia.org/wiki/Diplomacy_(game)
[2]:http://dipl.io
[3]:https://github.com/zond/godip
[4]:http://www.diplom.org/Zine/S2009M/Kruijswijk/DipMath_Chp1.htm

# Test Cases

The primary goal of the module is to be accurate. Full compliance with the [Diplomacy Adjudication Test Cases][1] is expected. To run the test cases yourself:

1. Clone this repository.
2. Run `npm test` within the repository directory.

[1]:http://web.inter.nl.net/users/L.B.Kruijswijk/
