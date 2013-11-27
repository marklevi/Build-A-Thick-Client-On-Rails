// when the page loads we need to grab the list of quizzes
// - fill the <ul> with one <li> per quiz
// - set the <li id="val"> to the quiz_id property of each quiz
// - set the html text inside each <li> to the name property of each quiz

// when we click on one of the quizzes
// // - create a session_key
// // - generate the request URL '/quizzes/1/questions/next.json?session_key=123123'
// // - use ajax to GET the request
// // - receive the response
//   - generate a view of the quiz question
//   - generate a view of the quiz answers
//   - allow the user to choose an answer

// when we choose an answer
// - reuse the session_key
// - generate the POST payload  {session_key: 'a124f87dec55da23', choice_id: 12 }
// - use ajax to POST the request
// - receive the response
//   - show the user some message about right vs. wrong answer
//   - highlight the correct choice (if user was wrong)
//   - report on total quiz progress
//   - offer a "next" button if the quiz has more questions


// QuizMachine: represents the main machine that starts a selected quiz
//   - start - show list of quizzes with listeners attached
//   - quiz  - starts the quiz

// Quiz: represents a group of questions and answers, next question, etc.
//   - start - show first question (next if next has never been called)
//   - next  - show next question with answers
//   - end   - called if user abandons quiz or if quiz runs out of questions
//   - questions - list of questions for this quiz that builds up over time

// Question: represents a question
//   - answers - list of answers for this question
//   -

// Answer: represents an answer


// Score: represents current score, any messages to the user
//   - prompt - show a message to the user
//   - total - show current total (running or final) scorae


// $('#answers li[id=1]').toggleClass('incorrect')
// $('#answers li[id=1]').toggleClass('correct')

// $('#btn-next').prop('disabled', true)
// $('#btn-next').prop('disabled', false)

$(document).ready(function(){
  var sk = Math.random().toString(36).substring(7);
  var quiz_name = null;
  var quiz_id = null;
  var last_response = null;

  //--------------------------------------------------------------------------------
  // this could be a main object to set things up
  // like QuizManager object or something
  // with a start() method on it that covers 67-83
  //--------------------------------------------------------------------------------


  // load the main page
  $.get('/quizzes.json')
   .done(function(data) {

    // generate a list of available quizzes
    for (var i = 0; i < data.quizzes.length; i++) {
      $('#page-1 #quizzes').append('<li id="'
        +data.quizzes[i].quiz_id+'">'
        +data.quizzes[i].name+'</li>')
    };

    // make the list item elements clickable (with the mouse pointer and stuff)
    $('#page-1 #quizzes').children().toggleClass('clickable')

    // show the main page
    $('#page-1').toggle();
  });

  //--------------------------------------------------------------------------------
  // this is doing a lot
  // probably a couple of objects.
  // one could be PageManager with a nextPage() method
  // one could be Quiz with a start() method
  //--------------------------------------------------------------------------------

  // show the selected quiz when the user clicks on its name
  $('#quizzes').on('click', 'li', function(e){

    // store the quiz name and id for later use
    quiz_name = this.innerHTML;
    quiz_id = this.id;

    // show the user the name of the quiz
    $('#quiz-name-p2').html(quiz_name);

    // get the next question for the quiz (or first question when first loaded)
    $.get('/quizzes/'+quiz_id+'/questions/next.json?session_key='+sk)
     .done(function(data) {

        // show the question
        $('#question').html(data.question.question);

        // store the quiz id
        $('#quiz-name-p2').data('quiz-id', quiz_id);

        // store the question id
        $('#answers').data('question-id', data.question.choices[0].question_id);

        // add all the answers to a list of choices
        for (var i = 0; i < data.question.choices.length; i++) {
          $('#answers').append('<li '
            +'id="'+data.question.choices[i].choice_id+'"'
            +'>'+data.question.choices[i].choice+'</li>');
        };

        // make the list item elements clickable (with the mouse pointer and stuff)
        $('#page-2 #answers').children().toggleClass('clickable')

        // turn on the listener for each answer
        $('#answers').on('click', 'li', expectAnswer);

        // hide the first page
        $('#page-1').toggle();

        // show the second page (this is the one with the quiz)
        $('#page-2').toggle();

     })
     .error(function(data){
        err = JSON.parse(data.responseText);
        alert(err.message);
     });
  });

  //--------------------------------------------------------------------------------
  //
  //--------------------------------------------------------------------------------

  // this function is shared and attached as the callback for all answer clicks
  var expectAnswer = function(e){

    // don't allow the user to change their answer
    $('#answers').unbind('click');

    // submit the answer
    $.ajax({
      method: 'post',
      url: '/questions/'+$(this).closest('ul').data('question-id')+'/answers.json',
      data: {session_key: sk, choice_id: this.id}
    })
     .done(function(data){
      // save the server response for later
      last_response = data;

      // highlight correct vs. incorrect answers
      $('#answers li[id='+data.status.correct_choice_id+']').toggleClass('correct')
      if (!data.status.correct) {
        $('#answers li[id='+data.status.submitted_choice_id+']').toggleClass('incorrect')
      };

      // enable the finish button after at least one answer has been given
      $('#btn-finish').prop('disabled', false);

      // enable or disable the next button depending on whether or not there are answers left
      if (data.status.more_questions) {
        $('#btn-next').prop('disabled', false);
      } else {
        $('#btn-next').prop('disabled', true);
      };

     })
     .error(function(data) {
        err = JSON.parse(data.responseText);
        alert(err.message);
     })
  };

  //--------------------------------------------------------------------------------

  // button to move to the next question
  $('#btn-next').on('click', function(e) {

    // hide page 2
    $('#page-2').toggle();

    // clear the previous answers
    $('#answers').empty();

    // get the next question
    $.get('/quizzes/'+quiz_id+'/questions/next.json?session_key='+sk)
     .done(function(data) {

        // show the user the question
        $('#question').html(data.question.question)

        // keep the question id for later
        $('#answers').data('question-id', data.question.choices[0].question_id);

        // add all the answers for this question
        for (var i = 0; i < data.question.choices.length; i++) {
          $('#answers').append('<li '
            +'id="'+data.question.choices[i].choice_id+'"'
            +'>'+data.question.choices[i].choice+'</li>');
        };

        // show page 2
        $('#page-2').toggle();

        // make the list item elements clickable (with the mouse pointer and stuff)
        $('#page-2 #answers').children().toggleClass('clickable')

        // listen to what the user does
        $('#answers').on('click', 'li', expectAnswer);

        // disable the next button
        $('#btn-next').prop('disabled', true);

     })
     .error(function(data){
        err = JSON.parse(data.responseText);
        alert(err.message);
     });
  })

  //--------------------------------------------------------------------------------

  // let the user click finish
  $('#btn-finish').on('click', function(e) {

    // hide page 2
    $('#page-2').toggle()

    // show the quiz name
    $('#quiz-name-p3').html(quiz_name);

    // setup the summary statement
    $('#summary').html('You scored ' + last_response.status.num_correct + '/'
          + (last_response.status.num_incorrect
          + last_response.status.num_correct) + ' correct')

    // show page 3 when it's ready
    $('#page-3').toggle()
  });

  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------

});


//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------

//          root      /                                        home#index
//       quizzes GET  /quizzes.:format                         quizzes#index {:format=>/json/}
// next_question GET  /quizzes/:quiz_id/questions/next.:format questions#next {:format=>/json/}
// submit_answer POST /questions/:question_id/answers.:format  questions#answer {:format=>/json/}

// ------------------------------------------------------------------------

// $('#page-1').toggle()

// GET '/quizzes.json'
// {
//   "quizzes":[
//     {"quiz_id":1,"name":"Dev Bootcamp Questions"},
//     {"quiz_id":2,"name":"Favorite Food"},
//     {"quiz_id":3,"name":"Favorite Movies"}
//   ]
// }

// $('#page-1').toggle()

// ------------------------------------------------------------------------

// $('#page-2').toggle()

// GET '/quizzes/1/questions/next.json?session_key=123123'
// {"question":
//   {"question_id":1,"question":"Who is your favorite teacher?",
//     "choices":[
//       {"quiz_id":1,"question_id":1,"choice_id":1,"choice":"Matt"},
//       {"quiz_id":1,"question_id":1,"choice_id":2,"choice":"Strand"},
//       {"quiz_id":1,"question_id":1,"choice_id":3,"choice":"Jeffrey"},
//       {"quiz_id":1,"question_id":1,"choice_id":4,"choice":"None of the Above"}
//     ]
//   }
// }

// ------------------------------------------------------------------------

// POST '/questions/1/answers.json'
// { session_key: 'a124f87dec55da23', choice_id: 12 }
// {
//   status: {
//     quiz_id: 1,
//     question_id: 1,
//     more_questions: true,
//     correct: false,
//     submitted_choice_id: 12,
//     correct_choice_id: 13,
//     num_correct: 0,
//     num_incorrect: 1
//   }
// }

// ------------------------------------------------------------------------

// $('#page-3').toggle()

// $('#answers li[id=1]').toggleClass('incorrect')
// $('#answers li[id=1]').toggleClass('correct')

// $('#btn-next').prop('disabled', true)
// $('#btn-next').prop('disabled', false)
