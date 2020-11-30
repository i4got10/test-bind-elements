bindElements('.box-absolute', '.box-fixed');
bindElements('.box-scroll', '.box-fixed');
bindElements('.box-sticky', '.box-absolute');
bindElements('.box-sticky', '.box-inline');

// bindElements('.geolink__button', '.input__voice-search');

document.querySelectorAll('#btn1')[0].addEventListener('click', () => {
  const div = document.createElement('div');

  div.style.height = '20px';

  document.body.insertBefore(div, document.body.childNodes[0]);
});
