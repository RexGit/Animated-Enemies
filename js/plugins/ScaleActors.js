//=============================================================================
// ScaleActors.js
// Version: 1.0 -
//=============================================================================

var Imported = Imported || {};
Imported.ScaleActors = true;

var Rexal = Rexal || {};
Rexal.SA = Rexal.SA || {};
/*:
 * @plugindesc Version: 1.0
 * - Allows you to scale an actor's battler.
 * @author Rexal
 *

  * @help

 --------------------------------------------------------------------------------
 Notetags
 ================================================================================
 
 Battler Scale: amount
 
 multiplies the size of the actor's battler by this amount.
 
 
 --------------------------------------------------------------------------------
 Version Log
 ================================================================================
  
 v1 - Initial Version

 */

   //-----------------------------------------------------------------------------
 // Sprite_Actor
//=============================================================================


Sprite_Actor.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._actor.battlerName();
    if (this._battlerName !== name) {
		this._actor._scale = 1;
        this._battlerName = name;
        this._mainSprite.bitmap = ImageManager.loadSvActor(name);
		Rexal.SA.processActorNoteTag($dataActors[this._actor.actorId()]);
		Rexal.SA.processActorData(this._actor,$dataActors[this._actor.actorId()]);
		console.info(this._actor.scale);
		this._mainSprite.scale.x = 1*this._actor._scale;
		this._mainSprite.scale.y = 1*this._actor._scale;
    }
};

  //-----------------------------------------------------------------------------
 // Rex Functions
//=============================================================================

Object.defineProperties(Game_Actor.prototype, {
  scale: { get: function() { return this._scale; }, configurable: true }
});


Rexal.SA.processActorData = function(obj,obj2) {
obj._scale = obj2.scale;
}

Rexal.SA.processActorNoteTag = function(obj) {

obj.scale = 1.0;

if(obj == null)return;

		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		var lines = line.split(': ');
		
		switch (lines[0].toLowerCase()) {
		
		case 'battler scale' :
		obj.scale = parseFloat(lines[1]);
		}
		
			
		}
		return obj;
};