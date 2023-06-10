function InstructionsPage() {

  return (
    <div>
      <h2>Instructions</h2>
      <p>
        <strong>Welcome to AI-powered Rock, Paper, Scissors! 🎉</strong>
      </p>
      <p>
        🗿 Rock beats scissors, 📜 Paper beats rock, ✂️ Scissors beats paper.
      </p>
      <p>
        Make your move with your camera (🗿=Fist, 📜=Open hand, ✂️=Peace sign) or simply select an emoji.
      </p>
      <p>
        <strong>Behind the scenes:</strong> A <a href="https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-data-science" target="_blank" rel="noreferrer">Red Hat OpenShift Data Science</a> model processes your image.
      </p>
      <p>Your user name is</p>
      <button>Ready, Set, Play!</button>
    </div>
  );
}

export default InstructionsPage;
