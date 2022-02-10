function start(){
   
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'> </div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'> </div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'> </div>");
    $("#fundoGame").append("<div id='inimigo2' > </div>");
    $("#fundoGame").append("<div id='placar' > </div>");
    $("#fundoGame").append("<div id='energia' > </div>");

    var somMusicafundo = document.getElementById("somMusicafundo");
    var somExplosao = document.getElementById("somExplosao");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");
    var somDisparo = document.getElementById("somDisparo");

    somMusicafundo.addEventListener("ended",function(){somMusicafundo.currentTime = 0; somMusicafundo.play()},false);
    somMusicafundo.play();
    

    var jogo = {};
    var energiaAtual = 3;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var podeAtirar = true;
    var fimdejogo = false;
    var velocidade = 5;
    var tecla = {
        W : 87,
        S : 83,
        D : 68
    }

    jogo.pressionou = []

    $(document).keydown(function (e) { 
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function (e) { 
        jogo.pressionou[e.which] = false;
    });

    jogo.time = setInterval(loop,30);

    function loop(){
        moveamigo()
        movefundo()
        movejogador()
        moveinimigo1()
        moveinimigo2()
        colisao()
        placar()
        energia();
    }

    function movefundo(){
        var esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 1);
    }

   function movejogador(){
        
        if(jogo.pressionou[tecla.W]){
            let top = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", top-10);

               if(top <= 0)
               $("#jogador").css("top", top+10);
        }

        if(jogo.pressionou[tecla.S]){
            var top = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", top+10);

                if(top >= 434)
                $("#jogador").css("top", top-10);
        }

        if(jogo.pressionou[tecla.D]){
            disparo()
        }
    }

   function moveinimigo1(){
        let posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX-velocidade);

        if(posicaoX <= 0){
           let posicaoY = parseInt(Math.random() * 334);
           $("#inimigo1").css("left", 694);
           $("#inimigo1").css("top", posicaoY);
        }
    }

   function moveinimigo2(){

        let posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX-3);
    
        if(posicaoX <= 0)
            $("#inimigo2").css("left", 775);

    }

    function moveamigo(){

        let posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX+1);

        if(posicaoX >= 906)
            $("#amigo").css("left", 0);
    }

    function disparo(){

        if(podeAtirar){
            
            somDisparo.play();
            podeAtirar = false;

            let top = parseInt($("#jogador").css("top"));
            let posicaoX = parseInt($("#jogador").css("left"));
            let tiroX = posicaoX + 190;
            let tiroY = top + 42;
            $("#fundoGame").append("<div id='disparo' > </div>");
            $("#disparo").css("left", tiroX);
            $("#disparo").css("top", tiroY);

            var tempoDisparo = window.setInterval(executaDisparo,30);

        }

              function executaDisparo(){
                let posicaoX = parseInt($("#disparo").css("left"));
                $("#disparo").css("left", posicaoX + 15);
  
                if(posicaoX >= 900){
                    window.clearInterval(tempoDisparo);
                    tempoDisparo = null;
                    $("#disparo").remove();
                    podeAtirar = true;
                }
              }

    }

    function colisao(){
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

        if(colisao1.length > 0){
            --energiaAtual;
            let inimigo1X = parseInt($("#inimigo1").css("left"));
            let inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao(inimigo1X,inimigo1Y);

            let posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        if(colisao2.length > 0){
            --energiaAtual;
            let inimigo2X = parseInt($("#inimigo2").css("left"));
            let inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);

            $("#inimigo2").remove();

            reposionaInimigo2()

        }

        if(colisao3.length > 0){
            velocidade += 3.0;
            pontos += 100;
            let inimigo1X = parseInt($("#inimigo1").css("left"));
            let inimigo1Y = parseInt($("#inimigo1").css("top"));

            explosao(inimigo1X,inimigo1Y);
            $("#disparo").css("left", 950);

            let posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        if(colisao4.length > 0){
            pontos += 50;
            let inimigo2X = parseInt($("#inimigo2").css("left"));
            let inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);

            $("#inimigo2").remove();
            $("#disparo").css("left", 950);

            reposionaInimigo2()

        }

        if(colisao5.length > 0){

            somResgate.play();
            ++salvos;
            reposionaAmigo();
            $("#amigo").remove();
        }

        if(colisao6.length > 0){
            ++perdidos;
            let amigoX = parseInt($("#amigo").css("left"));
            let amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);

            $("#amigo").remove();
            reposionaAmigo();

        }
    }

    function explosao(inimigo1X,inimigo1Y){
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'> </div>");
        $("#explosao1").css("background-image", "url('../images/explosao.png')");
        let div = $("#explosao1")
        div.css("top",inimigo1Y)
        div.css("left",inimigo1X)
        div.animate({width:200,opacity:0},"slow")

        let tempoExplosao = window.setInterval(removeExplosao,1000)

        function removeExplosao(){

            div.remove();
            window.clearInterval(tempoExplosao)
            tempoExplosao = null;
        }
        
    }

    function explosao2(inimigo2X,inimigo2Y){
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'> </div>");
        $("#explosao2").css("background-image", "url('../images/explosao.png')");
        let div2 = $("#explosao2")
        div2.css("top",inimigo2Y)
        div2.css("left",inimigo2X)
        div2.animate({width:200,opacity:0},"slow")

        let tempoExplosao2 = window.setInterval(removeExplosao2,1000)

        function removeExplosao2(){

            div2.remove();
            window.clearInterval(tempoExplosao2)
            tempoExplosao2 = null;
        }
        
    }

    function explosao3(amigoX,amigoY){
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'> </div>");
        let div2 = $("#explosao3")
        div2.css("top",amigoY)
        div2.css("left",amigoX)

        let tempoExplosao3 = window.setInterval(removeExplosao3,1000)

        function removeExplosao3(){

            div2.remove();
            window.clearInterval(tempoExplosao3)
            tempoExplosao3 = null;
        }
        
    }

    function  reposionaInimigo2(){

        let tempocolisao4 = window.setInterval(reposiona4,5000)

        function reposiona4(){

            window.clearInterval(tempocolisao4);
            tempocolisao4 = null;

            if(fimdejogo == false)
            $("#fundoGame").append("<div id='inimigo2' > </div>");
        }
    }

    function  reposionaAmigo(){

        let tempoAmigo = window.setInterval(reposiona6,6000)

        function reposiona6(){

            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if(fimdejogo == false)
            $("#fundoGame").append("<div id='amigo' class='anima3'> </div>");
        }
    }

    function placar(){
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    function energia(){

        if(energiaAtual == 3)
        $("#energia").css("background-image", "url('../images/energia3.png')");

        if(energiaAtual == 2)
        $("#energia").css("background-image", "url('../images/energia2.png')");

        if(energiaAtual == 1)
        $("#energia").css("background-image", "url('../images/energia1.png')");

        if(energiaAtual == 0){
        $("#energia").css("background-image", "url('../images/energia0.png')");
        gameOver();
        }
    }

    function gameOver(){

        $("#inimigo2").remove();
        $("#inimigo1").remove();
        $("#amigo").remove();
        $("#jogador").remove();
        fimdejogo = true;
        somMusicafundo.pause();
        somGameover.play();

        window.clearInterval(jogo.time);
        jogo.time = null;

        $("#fundoGame").append("<div id='fim' > </div>");

        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos +"</p>" + "<div id='reinicia' onclick=reiniciaJogo()><h3>Jogar Novamente</h3></div");
    }
}

function reiniciaJogo(){
    somGameover.pause()
    $("#fim").remove();
    start()
}