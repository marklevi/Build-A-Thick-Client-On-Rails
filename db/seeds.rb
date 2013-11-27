# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

quiz = Quiz.create(name: "Dev Bootcamp Questions")

question1 = quiz.questions.create(question: "Who is your favorite teacher?")
question1.choices.create(choice: "Matt", is_correct: false)
question1.choices.create(choice: "Strand", is_correct: false)
question1.choices.create(choice: "Jeffrey", is_correct: false)
question1.choices.create(choice: "None of the Above", is_correct: true)

question2 = quiz.questions.create(question: "Is Javascript awesome?")
question2.choices.create(choice: "Yes", is_correct: true)
question2.choices.create(choice: "No", is_correct: false)

question3 = quiz.questions.create(question: "Is Ruby awesome?")
question3.choices.create(choice: "Yes", is_correct: true)
question3.choices.create(choice: "No", is_correct: false)

question4 = quiz.questions.create(question: "Is CSS awesome?")
question4.choices.create(choice: "Yes", is_correct: false)
question4.choices.create(choice: "No", is_correct: true)


quiz = Quiz.create(name: "Lunch Questions")

question1 = quiz.questions.create(question: "What place has the best lunch?")
question1.choices.create(choice: "Murraci's", is_correct: true)
question1.choices.create(choice: "Passila", is_correct: false)
question1.choices.create(choice: "Have a Rice Day", is_correct: false)
question1.choices.create(choice: "None of the Above", is_correct: false)

question2 = quiz.questions.create(question: "What place has the cheapest lunch?")
question2.choices.create(choice: "Subway", is_correct: true)
question2.choices.create(choice: "Starbucks", is_correct: false)



