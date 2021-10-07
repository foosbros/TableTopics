var Stopwatch = function(elem, options) {

  var timer       = createTimer(),
      startButton = createButton("start", start),
      stopButton  = createButton("stop", stop),
      resetButton = createButton("reset", reset),
      offset,
      clock,
      interval;

  // default options
  options = options || {};
  options.delay = options.delay || 1;

  // append elements     
  elem.appendChild(timer);

  // initialize
  reset();

  // private functions
  function createTimer() {
    return document.createElement("span");
  }

  function createButton(action, handler) {
    var a = document.createElement("a");
    a.href = "#" + action;
    a.innerHTML = action;
    a.addEventListener("click", function(event) {
      handler();
      event.preventDefault();
    });
    return a;
  }

  function start() {
    if (!interval) {
      offset   = Date.now();
      interval = setInterval(update, options.delay);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
    render();
  }

  function update() {
    clock += delta();
    render();
  }

  function render() {
    var time = parseInt(clock/1000);
    timer.innerHTML = time;

    if(time > _maxSeconds) {
      $stopWatchAlert.removeClass("alert-info");
      $stopWatchAlert.removeClass("alert-success");
      $stopWatchAlert.addClass("alert-danger");
    } else if(time >= _minSeconds) {
      $stopWatchAlert.removeClass("alert-info");
      $stopWatchAlert.removeClass("alert-danger");
      $stopWatchAlert.addClass("alert-success");
    } else {
      $stopWatchAlert.removeClass("alert-danger");
      $stopWatchAlert.removeClass("alert-success");
      $stopWatchAlert.addClass("alert-info");
    }
  }

  function delta() {
    var now = Date.now(),
        d   = now - offset;

    offset = now;
    return d;
  }

  // public API
  this.start  = start;
  this.stop   = stop;
  this.reset  = reset;
};

var stopWatch;
var _minSeconds = 90;
var _maxSeconds = 120;
var $stopWatchAlert = $("#stop-watch-alert");

function newQuestion( ){
  resetTimer();

  getNextQuestion();
}

function startTimer() {
  stopWatch.start();
  $("#start-btn").attr("disabled", "disabled");
}

function resetTimer() {
  $stopWatchAlert.removeClass("alert-danger");
  $stopWatchAlert.removeClass("alert-success");
  $stopWatchAlert.addClass("alert-info");
  
  stopWatch.stop();
  stopWatch.reset();

  $("#start-btn").removeAttr("disabled");
}

$(function() {
  stopWatch = new Stopwatch($("#stopwatch")[0]);
  
  $("#min-seconds").change(minSecondsChange);
  $("#max-seconds").change(maxSecondsChange);
  
  $("#question-select").change(changeQuestions);

  questionList = defaultQuestions
  getNextQuestion();
  minSecondsChange();
  maxSecondsChange();
});

function minSecondsChange() {
  var minSeconds = $("#min-seconds");
  var maxSeconds = $("#max-seconds");

  _minSeconds = parseInt(minSeconds.find(":selected").text());

  var maxSecondOptions = maxSeconds.find("option");
  for(var i = 0; i < maxSecondOptions.length; ++i){
    var opt = $(maxSecondOptions[i]);

    if(parseInt(opt.text()) < _minSeconds){
      opt.attr("disabled", "disabled");
    } else {
      opt.removeAttr("disabled");
    }
  }
}

function changeQuestions(){  
  var questionSelect = $("#question-select");

  var questionSet = questionSelect.find(":selected").text();

  if(questionSet === "Silly")
  {
    usedQuestions = [-1];
    questionList = sillyQuestions;
    getNextQuestion();
  }
  else
  {
    usedQuestions = [-1];
    questionList = defaultQuestions;
    getNextQuestion();
  }
}

function maxSecondsChange() {
  var minSeconds = $("#min-seconds");
  var maxSeconds = $("#max-seconds");

  _maxSeconds = parseInt(maxSeconds.find(":selected").text());

  var minSecondOptions = minSeconds.find("option");
  for(var i = 0; i < minSecondOptions.length; ++i){
    var opt = $(minSecondOptions[i]);
    if(parseInt(opt.text()) > _maxSeconds){
      opt.attr("disabled", "disabled");
    } else {
      opt.removeAttr("disabled");
    }
  }
}

function getNextQuestion(){
  if(usedQuestions.length == questionList.length)
  {
    usedQuestions = [];
  }

  var nextQuestionNumber = parseInt(getRandomArbitrary(0, questionList.length));

  while(usedQuestions.indexOf(nextQuestionNumber) >= 0) {
     nextQuestionNumber = parseInt(getRandomArbitrary(0, questionList.length));
  }

  usedQuestions.push(nextQuestionNumber);

  $("#question").html(questionList[nextQuestionNumber]);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var usedQuestions = [-1];
var questionList;
