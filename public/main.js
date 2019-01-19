// P R O F I L E  C A R O U S E L
let profCardIndex = 1;

const plusProfCard = n => {
  showProfCards((profCardIndex += n));
};

const currentProfCard = n => {
  showProfCards((profCardIndex = n));
};

const showProfCards = n => {
  let cards = document.getElementsByClassName("profcards");
  let dots = document.getElementsByClassName("profdot");
  if (cards.length > 0 && dots.length > 0) {
    if (n > cards.length) {
      profCardIndex = 1;
    }
    if (n < 1) {
      profCardIndex = cards.length;
    }
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    cards[profCardIndex - 1].style.display = "flex";
    dots[profCardIndex - 1].className += " active";
  }
};

showProfCards(profCardIndex);

// T E X T  C A R O U S E L

let textCardIndex = 1;

const plusTextCard = n => {
  showTextCards((textCardIndex += n));
};

const currentTextCard = n => {
  showTextCards((textCardIndex = n));
};

const showTextCards = n => {
  let cards = document.getElementsByClassName("textcards");
  let dots = document.getElementsByClassName("textdot");
  if (cards.length > 0 && dots.length > 0) {
    if (n > cards.length) {
      textCardIndex = 1;
    }
    if (n < 1) {
      textCardIndex = cards.length;
    }
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    cards[textCardIndex - 1].style.display = "flex";
    dots[textCardIndex - 1].className += " active";
  }
};

showTextCards(textCardIndex);

// S E L E C T  T E X T
const textCard = e => {
  e.preventDefault();
  let textCard = e.target;
  console.log(e.target);
  if (textCard.className.includes(" activeCard")) {
    textCard.classList.remove("activeCard");
  } else {
    let activeText = document.getElementsByClassName("activeCard")[0];
    if (activeText) {
      activeText.classList.remove("activeCard");
    }
    textCard.className += " activeCard";
  }
};

// R E M O V E  U S E D C A R D  F R O M  T E X T
const removeUsedCard = id => {
  if (id) document.getElementById(id).classList.remove("usedCard");
};

// E R R O R  M E S S A G E
const toggleError = val => {
  if (val === "show") {
    let errorBox = document.getElementsByClassName("errorbox")[0];
    errorBox.innerHTML = "<p>You've used this text already</p>";
  } else if (val === "hide") {
    let errorBox = document.getElementsByClassName("errorbox")[0];
    while (errorBox.firstChild) errorBox.removeChild(errorBox.firstChild);
  } else if (val === "missing") {
    let errorBox = document.getElementsByClassName("errorbox")[0];
    errorBox.innerHTML = "<p>You must match all texts to profiles</p>";
  }
};

// C R E A T E  M E R G E D  P R O F I L E  &  T E X T
const mergeProfileText = (profile, text) => {
  let newDom = document.createElement("img");
  newDom.setAttribute("src", `public/img/${profile}-${text.id}.jpg`);
  newDom.setAttribute("onclick", "profileCard(event)");
  newDom.classList.add("resize", "fade");
  newDom.id = `${profile}-${text.id}`;
  return newDom;
};

// S E T  T E X T  T O  P R O F I L E
const profileCard = e => {
  e.preventDefault();
  let activeText = document.getElementsByClassName("activeCard")[0];
  let currentProfile = e.target.id;
  let profileCardList = document.getElementsByClassName("profcards");
  profileCardList = Array.from(profileCardList);
  let usedValidator = false;
  if (activeText) {
    // if a textCard is selected and has class `activeCard`
    for (let i = 0; i < profileCardList.length; i++) {
      let profileImage = profileCardList[i].children[0];
      // if the profileImage is already merged with a textCard
      if (profileImage.id.includes("-")) {
        let textId = profileImage.id.split("-")[1];
        // if the merged profileImage's text is the same as the activeCard's text, return an error message
        if (textId === activeText.id) {
          toggleError("show");
          usedValidator = true;
          break;
        }
      }
    }

    if (currentProfile.includes("-") && !usedValidator) {
      let profile = currentProfile.split("-")[0];
      e.target.replaceWith(mergeProfileText(profile, activeText));
      activeText.classList.remove("activeCard");
      activeText.classList.add("usedCard");
      removeUsedCard(currentProfile.split("-")[1]);
      toggleError("hide");
    } else if (currentProfile && !usedValidator) {
      e.target.replaceWith(mergeProfileText(currentProfile, activeText));
      activeText.classList.remove("activeCard");
      activeText.classList.add("usedCard");
      toggleError("hide");
    }
  } else if (currentProfile.includes("-")) {
    // R E M O V E  T E X T  F R O M  P R O F I L E
    if (
      window.confirm("Do you want to remove the text from this profile card?")
    ) {
      let profile = e.target;
      let ogProfile = e.target.id.split("-")[0];
      removeUsedCard(e.target.id.split("-")[1]);
      profile.setAttribute("src", `public/img/${ogProfile}.jpg`);
      profile.id = `${ogProfile}`;
    }
  }
};

// S U B M I T  I M A G E S
const submitAll = e => {
  let profileCardList = document.getElementsByClassName("profcards");
  profileCardList = Array.from(profileCardList);
  let finalArray = [];
  let errorHandled = false;
  for (let i = 0; i < profileCardList.length; i++) {
    let profileImage = profileCardList[i].children[0];
    if (!profileImage.id.includes("-")) {
      e.preventDefault();
      errorHandled = true;
      toggleError("missing");
      break;
    } else {
      finalArray.push(profileImage.id);
    }
  }
  if (!errorHandled) {
    let arrStr = encodeURIComponent(JSON.stringify(finalArray));
    console.log(arrStr);
    let currentPage =
      "file:///C:/Developer/freelance/whitespace/quiz_confirm_page.html";
    location.assign(`${currentPage}?profile=${arrStr}`);
  }
};

// ----------------------------------------------------------

// D I S P L A Y  P R O F I L E  T E X T   I M A G E S
const displayProfileImages = () => {
  console.log(location.search.includes("profile"));
  if (location.search.includes("?profile=")) {
    let results = location.search.slice(9);
    let arr = decodeURIComponent(results);
    arr = JSON.parse(arr);
    let container = document.getElementsByClassName("resultsbox");
    for (let i = 0; i < arr.length; i++) {
      let newDom = document.createElement("img");
      newDom.setAttribute("src", `public/img/${arr[i]}.jpg`);
      newDom.classList.add("resize", "fade", "confirmprofcards");
      newDom.id = `${arr[i]}`;
      container[0].append(newDom);
    }
  }
};

// F I N A L  S U B M I T  R E S U L T S
const finalSubmit = e => {
  e.preventDefault();

  let finalProfileCardList = document.getElementsByClassName(
    "confirmprofcards"
  );
  finalProfileCardList = Array.from(finalProfileCardList);
  let finalArr = [];
  finalProfileCardList.forEach(node => {
    finalArr.push(node.id);
  });
  let arrStr = encodeURIComponent(JSON.stringify(finalArr));
  location.assign(
    `file:///C:/Developer/freelance/whitespace/quiz_results_page.html?results=${arrStr}`
  );
};

// R E S T A R T  Q U I Z
const restart = e => {
  e.preventDefault();

  if (
    window.confirm("Do you want to restart the quiz?")
  ) {
    location.assign(
      `file:///C:/Developer/freelance/whitespace/quiz_page.html`
    );
  }
};

// ----------------------------------------------------------

// D I S P L A Y  F I N A L  R E S U L T S
const displayFinalImages = () => {
  console.log(location.search.includes("?results="));
  if (location.search.includes("results")) {
    let results = location.search.slice(9);
    let arr = decodeURIComponent(results);
    arr = JSON.parse(arr);

    let scoreContainer = document.getElementsByClassName("scorebox");
    let finalDescription = document.getElementsByClassName("scoredescription");
    let firstContainer = document.getElementsByClassName("firstcontainer");
    let firstScoreContainer = document.getElementsByClassName("firstscorecontainer");
    let secondContainer = document.getElementsByClassName("secondcontainer");
    let secondScoreContainer = document.getElementsByClassName("secondscorecontainer");
    let numOfCorrectAnswers = 0;
    let correctAnswers = [
      "profile1-text1",
      "profile2-text2",
      "profile3-text3",
      "profile4-text4",
      "profile5-text5",
      "profile6-text6",
      "profile7-text7",
      "profile8-text8",
      "profile9-text9",
      "profile10-text10"
    ];

    for (let i = 0; i < arr.length; i++) {
      if (i < 5) {
        let newDom = document.createElement("img");
        let correctDom = document.createElement("div");
        let incorrectDom = document.createElement("div");
        correctDom.classList.add("correct");
        correctDom.innerHTML = "CORRECT"
        incorrectDom.classList.add("incorrect");
        incorrectDom.innerHTML = "INCORRECT"
        newDom.setAttribute("src", `public/img/${arr[i]}.jpg`);
        if (arr[i] === correctAnswers[i]) {
          numOfCorrectAnswers++;
          newDom.classList.add("finalresize");
          firstScoreContainer[0].append(correctDom);
        } else {
          newDom.classList.add("finalresize");
          firstScoreContainer[0].append(incorrectDom);
        }
        newDom.id = `${arr[i]}`;
        firstContainer[0].append(newDom);
      } else {
        let newDom = document.createElement("img");
        let correctDom = document.createElement("div");
        let incorrectDom = document.createElement("div");
        correctDom.classList.add("correct");
        correctDom.innerHTML = "CORRECT"
        incorrectDom.classList.add("incorrect");
        incorrectDom.innerHTML = "INCORRECT"
        newDom.setAttribute("src", `public/img/${arr[i]}.jpg`);
        if (arr[i] === correctAnswers[i]) {
          numOfCorrectAnswers++;
          newDom.classList.add("finalresize");
          secondScoreContainer[0].append(correctDom);
        } else {
          newDom.classList.add("finalresize");
          secondScoreContainer[0].append(incorrectDom);
        }
        newDom.id = `${arr[i]}`;
        secondContainer[0].append(newDom);
      }
    }

    let scoreImage = document.createElement("img");
    scoreImage.setAttribute(
      "src",
      `public/img/scoring-${numOfCorrectAnswers}.jpg`
    );
    scoreImage.classList.add("finalscore");
    scoreContainer[0].append(scoreImage);

    let finalResultDescription = resultDescriptions[`scoring-${numOfCorrectAnswers}`];
    finalDescription[0].innerHTML = `<p class="finalscoredesc">${finalResultDescription}</p>`;
  }
};

// R E S U L T  D E S C R I P T I O N
const resultDescriptions = {
  "scoring-0":
    "This result shows some bias in your perception of race and gender. Studies show that our external environment and upbringing are correlated to false perceptions of individuals or lumping entire groups of people into singular categories. Run through White Space to see how see perceptions can create images that hurt.",
  "scoring-1":
    "Your score shows that you may struggle with some bias towards others. Use White Space in your future work to diversify your message, or to avoid any offensive material that may be produced.",
  "scoring-2":
    "Your score is the average amongst many who have taken this test. Bias exists within a standard measure of race and roles in society. Use White Space in your future work to diversify your message, or to avoid any offensive material that may be produced.",
  "scoring-3":
    "Very good. Your score is slightly above average amongst many who have taken this test. Bias exists within a standard measure of race and roles in society. Use White Space in your future work to diversify your message, or to avoid any offensive material that may be produced.",
  "scoring-4":
    "You are sensitive. Your score is above average amongst many who have taken this test. Bias exists within a standard measure of race and roles in society. Use White Space in your future work to diversify your message, or to avoid any offensive material that may be produced.",
  "scoring-5":
    "Great job! Your score indicates a great eye for detail in analyzing and choosing photo references. Bias exists within a standard measure of race and roles in society. Use White Space in your future work to diversify your message, or to avoid any offensive material that may be produced.",
  "scoring-6":
    "Amazing! This is not an easy test and you are keyed into understanding bias in society. Bias exists within a standard measure of race and roles in society. Use White Space in your future work to continue to diversify your message, or to avoid any offensive material that may be produced.",
  "scoring-7":
    "Wow! This is a very high score and demonstrates your understanding of bias and how to counter societal narratives. Bias exists within a standard measure of race and roles in society. Use White Space in your future work to continue to diversify your message, or to avoid any offensive material that may be produced.",
  "scoring-8":
    "Excellent score. These results show an extreme sensitivity to race and stereotyping. Bias exists within a standard measure of race and roles in society. Use White Space in your future work to continue to diversify your message, or to avoid any offensive material that may be produced.",
  "scoring-9":
    "It may be personal. Your score indicates a sensitivity that exhibits an understanding of stereotyping either through study, or you may have experienced stereotyping in your own life. Bias exists within a standard measure of race and roles in society. Use White Space in your future work to diversify your message, or to avoid any offensive material that may be produced.",
  "scoring-10":
    "Rare score. Other than the creator and members of the research team, this score is rare and indicates a high awareness of others and how othering works in society. Bias exists within a standard measure of race and roles in society. Use White Space in your future work to diversify your message, or to avoid any offensive material that may be produced."
};

displayProfileImages();
displayFinalImages();
