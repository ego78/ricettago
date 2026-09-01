const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const state={recipes:[],plan:[],shopping:[],photo:null};
const DAYS=["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"], MEALS=["Colazione","Pranzo","Cena"];
function apiUrl(){return localStorage.getItem("ricettago_api")||""}
async function api(action,payload={}){
  if(!apiUrl()) throw new Error("Configura prima l'URL di Google Apps Script in ⚙️.");
  const r=await fetch(apiUrl(),{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,...payload})});
  const j=await r.json(); if(!j.ok) throw new Error(j.error||"Errore backend"); return j.data;
}
function showPage(id){$$(".page").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");$$("nav button").forEach(x=>x.classList.toggle("active",x.dataset.page===id));if(id==="library")loadRecipes();if(id==="planner")loadPlanner();if(id==="shopping")loadShopping();scrollTo(0,0)}
window.showPage=showPage;
$$("nav button").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
$("#settingsBtn").onclick=()=>showPage("settings");
$("#apiUrl").value=apiUrl();
$("#saveSettings").onclick=()=>{localStorage.setItem("ricettago_api",$("#apiUrl").value.trim());alert("Configurazione salvata");showPage("home");loadRecipes()};
$("#photo").onchange=e=>{state.photo=e.target.files[0]||null;$("#photoName").textContent=state.photo?state.photo.name:""};
function file64(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
$("#importBtn").onclick=async()=>{
 try{
  $("#status").textContent="Sto preparando la ricetta…";
  let imageData=null;if(state.photo)imageData=await file64(state.photo);
  const data=await api("importRecipe",{source:$("#sourceText").value.trim(),imageData});
  $("#status").textContent="✓ Ricetta salvata";$("#sourceText").value="";$("#photo").value="";state.photo=null;$("#photoName").textContent="";
  await loadRecipes();openRecipe(data.id);
 }catch(e){$("#status").textContent="⚠️ "+e.message}
};
function card(r){return `<article class="recipeCard" onclick="openRecipe('${r.id}')">${r.imageUrl?`<img src="${r.imageUrl}" alt="">`:`<div style="height:130px;display:grid;place-items:center;font-size:42px">🍽️</div>`}<div class="pad"><h3>${esc(r.title)}</h3><div class="meta">${r.time||""} ${r.servings?`• ${r.servings} porz.`:""}</div></div></article>`}
async function loadRecipes(){try{state.recipes=await api("listRecipes");renderRecipes();$("#recent").innerHTML=state.recipes.slice(0,4).map(card).join("")}catch(e){$("#recent").innerHTML=`<p class="muted">${e.message}</p>`}}
function renderRecipes(){let q=($("#search").value||"").toLowerCase();$("#recipes").innerHTML=state.recipes.filter(r=>r.title.toLowerCase().includes(q)).map(card).join("")||"<p>Nessuna ricetta.</p>"}
$("#search").oninput=renderRecipes;
async function openRecipe(id){try{const r=await api("getRecipe",{id});$("#recipeDetail").innerHTML=`${r.imageUrl?`<img class="detailImg" src="${r.imageUrl}">`:""}<h1>${esc(r.title)}</h1><div class="chips"><span class="chip">⏱ ${r.time||"—"}</span><span class="chip">👥 ${r.servings||"—"} porzioni</span><span class="chip">🔥 ${r.calories||"—"} kcal</span><span class="chip">P ${r.protein||"—"}g</span><span class="chip">C ${r.carbs||"—"}g</span><span class="chip">G ${r.fat||"—"}g</span></div><h2>Ingredienti</h2><ul class="ingredients">${(r.ingredients||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul><h2>Procedimento</h2><ol class="steps">${(r.steps||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ol><button class="secondary" onclick="deleteRecipe('${r.id}')">Elimina ricetta</button>`;showPage("recipe")}catch(e){alert(e.message)}}
window.openRecipe=openRecipe;
async function deleteRecipe(id){if(confirm("Eliminare questa ricetta?")){await api("deleteRecipe",{id});showPage("library")}}
window.deleteRecipe=deleteRecipe;
async function loadPlanner(){try{const data=await api("getPlanner");state.plan=data.plan||[];state.recipes=data.recipes||[];$("#plan").innerHTML=DAYS.map(day=>`<div class="card day"><h3>${day}</h3>${MEALS.map(meal=>{let cur=state.plan.find(x=>x.day===day&&x.meal===meal)?.recipeId||"";return `<div class="meal"><b>${meal}</b><select onchange="saveMeal('${day}','${meal}',this.value)"><option value="">—</option>${state.recipes.map(r=>`<option value="${r.id}" ${cur===r.id?"selected":""}>${esc(r.title)}</option>`).join("")}</select></div>`}).join("")}</div>`).join("")}catch(e){$("#plan").innerHTML=e.message}}
async function saveMeal(day,meal,recipeId){try{await api("saveMeal",{day,meal,recipeId})}catch(e){alert(e.message)}} window.saveMeal=saveMeal;
async function loadShopping(){try{state.shopping=await api("getShopping");renderShopping()}catch(e){$("#shoppingList").innerHTML=e.message}}
function renderShopping(){$("#shoppingList").innerHTML=state.shopping.length?state.shopping.map(x=>`<div class="shopItem ${x.done?"done":""}"><input style="width:auto" type="checkbox" ${x.done?"checked":""} onchange="toggleShop('${x.id}',this.checked)"><span>${esc(x.item)}</span></div>`).join(""):"<p class='muted'>La lista è vuota.</p>"}
async function toggleShop(id,done){await api("toggleShopping",{id,done});loadShopping()} window.toggleShop=toggleShop;
$("#buildShopping").onclick=async()=>{try{await api("buildShopping");loadShopping()}catch(e){alert(e.message)}};
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js");
loadRecipes();