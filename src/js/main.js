(function(window){

  $temperature = $('.temperature');
  /** What event are we looking for? 'click'
    * Where are we looking for the event? '.temperature'
    * What happens after the click:
    */
  $temperature.click(function(event){
    event.preventDefault();
    $(this).toggleClass('temp-active');
    $($('a', this).attr("href")).toggleClass('active');
  });

})(window);
