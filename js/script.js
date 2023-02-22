const data = [
    {
        id: 1,
        question: "một cộng một",
        answer: ["2", "1", "6", "3"],
        correct: "3",
    },
    {
        id: 2,
        question: "một cộng một hai",
        answer: ["1", "2", "9"],
        correct: "1",
    },
];

let index = -1;

const renderQuestion = (object) => {
    let questionItem = "";
    let answerItem = "";
    index += 1;
    if (index < 0) {
        if (index < object.length) {
            object[index].answer.map((item) => {
                answerItem += `
                  <p class="answer">${item}</p>
              `;
            });
            questionItem = `
                      <div class="question">${object[index].question}</div>
                      <div>${answerItem}</div>
                      <button onclick="renderQuestion(data)">Next</button>
              `;
            document.getElementsByTagName("body")[0].innerHTML = questionItem;
        }
    }
    else {
        if (index < object.length) {
            object[index].answer.map((item) => {
                answerItem += `
                  <p class="answer">${item}</p>
              `;
            });
            questionItem = `
                      <div class="question">${object[index].question}</div>
                      <div>${answerItem}</div>
                      <button onclick="renderQuestion(data)">Next</button>
              `;
            document.getElementsByTagName("body")[0].innerHTML = questionItem;
        }
        activeAnswer();
    }
};

const activeAnswer = () => {
    const answer = document.getElementsByClassName('answer');
    for (let i = 0; i < answer.length; i++) {
        answer[i].addEventListener('click', () => {
            [...answer].forEach(ele => {
                ele.classList.remove('choice');
            });
            answer[i].classList.add('choice');
            const answerChoice = document.getElementsByClassName("choice")[0].innerHTML;
            const question = document.getElementsByClassName('question')[0].innerHTML;
            storageAnswer(question, answerChoice);
        })
    };
}

const storageAnswer = (question, answer) => {
    const questionCount = {
        question: question,
        answer: answer
    };
    return questionCount;
}

document.getElementById("btn-start").addEventListener("click", () => renderQuestion(data));
