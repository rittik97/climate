function readURL(input) {
if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
        $('#blah')
            .attr('src', e.target.result)
            .width(150)
            .height(200);
    };

    reader.readAsDataURL(input.files[0]);
}
}

function classify(id){
  x=document.getElementById(id)
  SendAjax(x.querySelector(".card-img-top").src,x);
}
function SendAjax(url,elem){


    $.post('/classify',
        { data: url},
        function(data, status, xhr) {
          x.querySelector(".card-text").innerHTML=data
          
          console.log(data2)
          console.log(data2/(data['bill']))
            if (data2/(data['bill'])<=0.14){
              temp=Math.round(data['bill']*0.14)
              document.getElementById("tip").innerHTML='Suggested total tip amount: '+temp;
            }else{
              document.getElementById("tip").innerHTML='Suggested total tip amount: '+data2;
            }
            form.reset()

            //alert('status: ' + status + ', data: ' + data);

        }).done(function() {  })
        .fail(function(jqxhr, settings, ex) { alert('failed, ' + ex); });
}
