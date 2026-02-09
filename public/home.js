const touristBubble = document.getElementById("touristBubble");
const localBubble = document.getElementById("localBubble");
const touristText = document.getElementById("touristText");
const localText = document.getElementById("localText");
const conversationBanner = document.getElementById("conversation");

conversationBanner.onclick = function(){
    
    touristText.textContent = "tourist text"
    localText.textContent = "local text"
};