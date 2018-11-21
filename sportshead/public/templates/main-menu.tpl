<div class="container" style="width: 1150px; height: 700px; padding: 25px">
  <div class="card-panel">
    <div class="row">
      <div class="card white lighten-2">
        <div class="card-content">
          <p><span="card-title">Bienvenue sur Cetelem-Heads</span></p>

          <div class="row">
            <div id="offlineModal" class="modal">
              <div class="modal-content">
                <h4>Choisissez vos options</h4>
                <div class="row">
                  <form class="col s12">
                    <div class="row">
                      <div class="input-field col s2">
                        <label for="offline.players.amount">Nombre de joueurs</label>
                      </div>
                      <div class="input-field col s4">
                        <p>
                          <input id="offline.players.amount.two" name="offline.players.amount" type="radio" value="2" checked/>
                          <label for="offline.players.amount.two">2</label>
                        </p>
                      </div>
                      <div class="input-field col s4">
                        <p>
                          <input id="offline.players.amount.four" name="offline.players.amount" type="radio" value="4"/>
                          <label for="offline.players.amount.four">4</label>
                        </p>
                      </div>
                    </div>

                    <div class="row">
                      <div class="input-field col s2">
                        <label>Activer les gamelles</label>
                      </div>
                      <div class="input-field col s8">
                        <p>
                          <input id="offline.goals.tinEnabled" type="checkbox" checked/>
                          <label for="offline.goals.tinEnabled">Oui<label>
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="input-field col s2">
                        <label>Activer les bonus</label>
                      </div>
                      <div class="input-field col s8">
                        <input id="offline.events.bonuses" type="checkbox" checked/>
                        <label for="offline.events.bonuses">Oui<label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="input-field col s2">
                        <label>Activer les malus</label>
                      </div>
                      <div class="input-field col s8">
                        <p>
                          <input id="offline.events.penalties" type="checkbox" checked/>
                          <label for="offline.events.penalties">Oui</label>
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="input-field col s2">
                        <label>Activer les autres événement</label>
                      </div>
                      <div class="input-field col s8">
                        <p>
                          <input id="offline.events.others" type="checkbox" checked/>
                          <label for="offline.events.others">Oui</label>
                        </p>
                      </div>
                    </div>

                    <div class="row">
                      <div class="input-field col s2">
                        <label for="offline.players.skins.0">Skin joueur 1</label>
                      </div>
                      <div class="input-field col s8">
                        <select id="offline.players.skins.0">
                          <option value="player_italia">Italie</option>
                          <option value="player_mathieu">Mathieu Vidalies</option>
                          <option value="player_kevin">Kevin Bonnoron</option>
                        </select>
                      </div>
                    </div>
                    <div class="row">
                      <div class="input-field col s2">
                        <label for="offline.players.skins.1">Skin joueur 2</label>
                      </div>
                      <div class="input-field col s8">
                        <select id="offline.players.skins.1">
                          <option value="player_italia">Italie</option>
                          <option value="player_mathieu">Mathieu Vidalies</option>
                          <option value="player_kevin">Kevin Bonnoron</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <a id="offline.submit" href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Jouer</a>
              </div>
            </div>

            <button class="btn modal-trigger waves-effect waves-light btn col s6 offset-s3" data-target="offlineModal">Hors-ligne</button>
          </div>
          <div class="row">
            <button id="online.submit" class="btn modal-trigger waves-effect waves-light btn col s6 offset-s3" data-target="offlineModal">En-ligne</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  $('.modal-trigger').leanModal();
  $('select').material_select();
</script>
