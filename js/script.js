const getExam = async (idExam) => {
  const res = await fetch(`https://app.scigroupvn.com/servey/servey-backend/public/api/get-question?examId=${idExam}`);
  const data = res.json();
  return data;
}

const createCustomer = async (body) => {
  const res = await fetch(`http://app.scigroupvn.com/servey/servey-backend/public/api/create-customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = res.json();
  return data;
}

const idExam = 6;
let dataExam = [];
let data = [];

const dataSuccessQuestion = [];
const dataSuccessQuestionFinal = [];
const dataSuccessQuestionPost = [];
const dataSuccessQuestionFinalPost = [];
let index = -1;

const renderQuestion = () => {
  let questionItem = "";
  let answerItem = "";
  index += 1;
  if (index < data.length) {
    data[index].answer.map((item) => {
      answerItem += `<li class="quiz__answerItem">${String(item.answer)}</li>`;
    });
    questionItem = `
        <div class="modal" id="modal-question" style="display: flex">
            <div class="modal-bg modal-bg-question"></div>
            <div class="modal-box animate-pop">
                <div class="modal-body">
                    <div class="modal-close" id="close-question">&times;</div>
                    <div>
                        <input class="quiz__id" type="hidden" value="${data[index].id}" />
                        <p>Câu: ${index + 1}/${data.length}</p>
                        <p class="quiz__headQuestion">${data[index].question}</p>
                        <ol class="quiz__answer">${answerItem}<ol>
                    </div>
                    <button type="button" class="button disable" id="next-question" onclick="renderQuestion()">${index == data.length - 1 ? "Xem kết quả" : "Tiếp tục"}</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById("box-popup").innerHTML = questionItem;
  }
  activeAnswer();
  let lastItem = dataSuccessQuestion[dataSuccessQuestion.length - 1];
  let lastItemPost = dataSuccessQuestionPost[dataSuccessQuestionPost.length - 1];
  dataSuccessQuestionFinal.push(lastItem);
  dataSuccessQuestionFinalPost.push(lastItemPost);
  if (index == data.length) {
    showResult();
  }
  dataSuccessQuestion.length = 0;
  dataSuccessQuestionPost.length = 0;
  if (document.getElementById("close-question")) {
    document.getElementById("close-question").addEventListener("click", () => {
      confirmClose();
    });
  }
};

const activeAnswer = () => {
  const answer = document.getElementsByClassName("quiz__answerItem");
  for (let i = 0; i < answer.length; i++) {
    answer[i].addEventListener("click", () => {
      [...answer].forEach((ele) => {
        ele.classList.remove("active");
      });
      answer[i].classList.add("active");
      const answerChoice =
        document.getElementsByClassName("active")[0].innerHTML;
      const question =
        document.getElementsByClassName("quiz__headQuestion")[0].innerHTML;
        const questionID =
        document.getElementsByClassName("quiz__id")[0].value;
      if (answerChoice.length !== 0) {
        document.getElementById("next-question").classList.remove("disable");
      }
      storageAnswer(question, answerChoice, questionID);
    });
  }
};

const storageAnswer = (question, answer, questionID) => {
  const successQuestion = {
    question: question,
    answer: answer,
  };
  const successQuestionPost = {
    answer: answer,
    question_id: questionID,
    exam_id: idExam
  };
  dataSuccessQuestion.push(successQuestion);
  dataSuccessQuestionPost.push(successQuestionPost);
};

const showResult = async (reload) => {
  if (reload == undefined) {
    dataSuccessQuestionFinal.shift();
    dataSuccessQuestionFinalPost.shift();
    try{
      await createCustomer(dataSuccessQuestionFinalPost);
    } catch (e){
      console.log(e)
    }
  }
  let questionFinal = "";
  let answerFinal = "";
  let result = "";
  let body = "";
  let inline = [];
  let btnShowResult = `<button type="button" class="button quiz__start quiz__again" onclick="showResult(true)">Xem kết quả</button>`;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].answer.length; j++) {
      answerFinal += `
            <li class="quiz__answerItem ${dataSuccessQuestionFinal[i].answer == data[i].correct_answer &&
          dataSuccessQuestionFinal[i].answer == data[i].answer[j].answer
          ? "correct "
          : dataSuccessQuestionFinal[i].answer !== data[i].correct_answer &&
            dataSuccessQuestionFinal[i].answer === data[i].answer[j].answer
            ? "incorrect "
            : data[i].correct_answer == data[i].answer[j].answer
              ? "correct"
              : ""
        }">${data[i].answer[j].answer}</li>
        `;
      result =
        `
          <div><strong>Đáp án bạn chọn: ${dataSuccessQuestionFinal[i].answer}</strong></div>
          <div>Đáp án đúng: ${data[i].correct_answer}</div>
          <div>Giải thích: ${data[i].explain}</div>
          <div>Kết quả: <strong>${dataSuccessQuestionFinal[i].answer == data[i].correct_answer ? "Đúng" : "Sai"}</strong></div>
        `
    }
    questionFinal += `
      <div class="quiz__questionItem">
        <p class="quiz__headQuestion">Câu ${i + 1}: ${data[i].question}</p>
        <ol class="quiz__answer">${answerFinal}</ol>
        <p>${result}</p>
      </div>
    `;
    answerFinal = "";
    result = "";
    if(dataSuccessQuestionFinal[i].answer == data[i].correct_answer){
      inline.push(dataSuccessQuestionFinal[i].answer);
    }
  }
  body = `
        <div class="modal modal__result" id="modal-result" style="display: flex">
            <div class="modal-bg modal-bg-result"></div>
            <div class="modal-box animate-pop">
                <div class="modal-body">
                    <div class="modal-close" id="close-result">&times;</div>
                    <div class="count__correct">Chúc mừng bạn đã hoàn thành trắc nghiệm với tỉ lệ ${inline.length}/${data.length}</div>
                    <div class="box__color">
                      <p>Màu <span class="color color--green"></span> là đáp án trả lời <strong>Đúng</strong> của câu hỏi.</p>
                      <p>Màu <span class="color color--red"></span> là đáp án trả lời <strong>Sai</strong> của câu hỏi.</p>
                    </div>
                    <div>${questionFinal}</div>
                    <button type="button" class="button" onclick="restartQuestion()">Làm lại</button>
                </div>
            </div>
        </div>
  `;
  document.getElementById("box-popup").innerHTML = body;
  if (document.getElementById("btn-start")) {
    document.getElementById("btn-start").remove();
  }
  if (!document.getElementsByClassName("quiz__again")[0]) {
    document
      .getElementsByClassName("quiz")[0]
      .insertAdjacentHTML("beforeend", btnShowResult);
  }
  document.getElementById("close-result").addEventListener("click", () => {
    document.getElementById("modal-result").remove();
  });
};

const restartQuestion = () => {
  let btnStart =
    '<button type="button" class="button quiz__start" id="btn-start" onclick="restartQuestion()">Bắt đầu</button>';
  index = -1;
  dataSuccessQuestion.length = 0;
  dataSuccessQuestionFinal.length = 0;
  dataSuccessQuestionPost.length = 0;
  dataSuccessQuestionFinalPost.length = 0;
  if (document.getElementsByClassName("quiz__again")[0]) {
    document.getElementsByClassName("quiz__again")[0].remove();
  }
  if (!document.getElementById("btn-start")) {
    document
      .getElementsByClassName("quiz")[0]
      .insertAdjacentHTML("beforeend", btnStart);
  }
  renderQuestion();
};

const confirmClose = async () => {
  let htmlConfirm = `
        <div class="modal modal__confirm" id="modal-confirm" style="display: flex">
          <div class="modal-bg"></div>
          <div class="modal-box animate-pop">
              <div class="modal-body">
                  <p>Bạn chưa hoàn thành bài trắc nghiệm. </br> Bạn có thực sự muốn thoát?</p>
                  <button type="button" class="button button--outline green confirm__btn" data-id="yes">Có</button>
                  <button type="button" class="button button--outline red confirm__btn" data-id="no">Không</button>
              </div>
          </div>
          </div>
          `;
  document
    .getElementById("box-popup")
    .insertAdjacentHTML("beforeend", htmlConfirm);
  const btnConfirm = document.getElementsByClassName("confirm__btn");
  for (let i = 0; i < btnConfirm.length; i++) {
    btnConfirm[i].addEventListener("click", async () => {
      const dataId = btnConfirm[i].getAttribute("data-id");
      if (dataId === "yes") {
        dataSuccessQuestionFinalPost.shift();
        let lengthFinalPost = dataSuccessQuestionFinalPost.length;
        let lengthExam = dataExam.question.length;
        for (lengthFinalPost; lengthFinalPost < lengthExam; lengthFinalPost++){
          const dataExamNull = {
            answer: '',
            question_id: dataExam.question[lengthFinalPost].id,
            exam_id: dataExam.examId
          }
          dataSuccessQuestionFinalPost.push(dataExamNull);
        }
        try{
          await createCustomer(dataSuccessQuestionFinalPost);
        } catch (e){
          console.log(e)
        }
        document.getElementById("modal-confirm").remove();
        document.getElementById("modal-question").remove();
      }
      if (dataId === "no") {
        document.getElementById("modal-confirm").remove();
      }
    });
  }
};

const confirmCloseOutSide = () => {
  window.addEventListener("click", (e) => {
    if (e.target == document.getElementsByClassName("modal-bg-question")[0]) {
      confirmClose();
    }
    if (e.target == document.getElementsByClassName("modal-bg-result")[0]) {
      document.getElementById("modal-result").remove();
    }
  });
};

confirmCloseOutSide();

window.onload = async () => {
  try{
    const dataLoad = await getExam(idExam);
    dataExam = dataLoad.data;
    data = dataExam.question;
  } catch (e){
    console.log(e);
  }
}
