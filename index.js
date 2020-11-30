wrapper('.box-absolute', '.box-fixed');
wrapper('.box-scroll', '.box-fixed');
wrapper('.box-sticky', '.box-absolute');
wrapper('.box-sticky', '.box-inline');

// wrapper('.geolink__button', '.input__voice-search');

document.querySelectorAll('#btn1')[0].addEventListener('click', () => {
  const div = document.createElement('div');

  div.style.height = '20px';

  document.body.insertBefore(div, document.body.childNodes[0]);
});
