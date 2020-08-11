import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-chatbothome',
  templateUrl: './chatbothome.component.html',
  styleUrls: ['./chatbothome.component.css'],
  encapsulation: ViewEncapsulation.None //colocado aqui pra atualizar o css sempre que um novo elemento é criado
})

// declare function require(name:string);
export class ChatbothomeComponent implements OnInit {
  
  constructor() { }
  
  ngOnInit(): void {
    const textInput = <HTMLInputElement>document.getElementById('textInput'); //pega texto digitado pelo usuário no input
    const chat = document.getElementById('chat'); //pegando div principal do chat
    let context = {};
    
    const templateChatMessage = (message, from) =>  `
    
    <div class="from-${from}">
      <div class="row align-items-center">
        <img src="../../assets/img/${from}.png" alt="" id="${from}Chat" class="col-3">
        <div class="message-inner inner${from} col-9 pl-0 my-3">
          <p>${message}</p>
        </div>
      </div>
    </div>
    `; // Cria template de diálogo do chatbot utilizando tags HTML
    
    const InsertTemplateInTheChat = (template) => {
      const div = document.createElement('div'); //cria uma div nova
      div.innerHTML = template; // pega a div criada e coloca o template feito na função anterior e joga dentro dela
      
      chat.appendChild(div); //coloca a div com o template dentro da div principal do chat
    };

    const getWatsonMessageAndInsertTemplate = async (text) => {
      const uri = 'http://localhost:3000/conversation/';
      const response = await (await fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          text ,
          context,
        }),
      })).json(); 
      
      const template = templateChatMessage(response, 'watson');

      InsertTemplateInTheChat(template);
    }

    textInput.addEventListener('keydown', (event) => {
      if (event.keyCode === 13 && textInput.value) {
        getWatsonMessageAndInsertTemplate(textInput.value); 
        const template = templateChatMessage(textInput.value, 'user');
        InsertTemplateInTheChat(template);
        
        textInput.value = ''; 
      }
    });

    getWatsonMessageAndInsertTemplate(textInput.value);
  
  }
  
}
