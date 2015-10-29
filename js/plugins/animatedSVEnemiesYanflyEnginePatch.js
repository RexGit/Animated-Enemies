//=============================================================================
// AnimatedSVEnemiesYanflyCompatability.js
// Version: 1.0
//=============================================================================

var Imported = Imported || {};
Imported.AnimatedSVEnemies.Yanfly = true;

var Rexal = Rexal || {};
Rexal.ASVE = Rexal.ASVE || {};
/*:
 * @plugindesc Makes animatedSVEnemies compatible with Yanfly's plugins.
 * @author Rexal
 *
 * @help

 Version Log:
 
 v1 - Initial Version
 
 */
 if(Imported.AnimatedSVEnemies){
	 
	 

 
 Rexal.ASVE.Parameters = PluginManager.parameters('animatedSVEnemies');
 Rexal.ASVE.NoMovement = eval(String(Rexal.ASVE.Parameters['No Movement']));
  //-----------------------------------------------------------------------------
// Game_Enemy
//=============================================================================

	
if(Yanfly.YEP_BattleEngineCore)
{

	Game_Enemy.prototype.spriteWidth = function() {
    if (Rexal.ASVE._animated) {
			return this.battler()._mainSprite.width;
		} else {
			return 1;
		}
};

Game_Enemy.prototype.spriteHeight = function() {
    if (Rexal.ASVE._animated) {
			return this.battler()._mainSprite.height;
		} else {
			return 1;
		}
};

}


  //-----------------------------------------------------------------------------
// Sprite_EnemyRex
//=============================================================================

if(Imported.YEP_BattleEngineCore)
{
	
Sprite_EnemyRex.prototype.stepFlinch = function() {
		var flinchX = this.x - this._homeX + Yanfly.Param.BECFlinchDist;
		this.startMove(flinchX, 0, 6);
};

}


if(Imported.YEP_CoreEngine && eval(Yanfly.Param.ReposBattlers))
{

	Sprite_EnemyRex.prototype.setActorHome = function(battler) {
			
			var dX = Graphics.boxWidth/816;
			var dY = Graphics.boxHeight/624;
	
			var x = battler.screenX(); 
			var y = battler.screenY();
			
			x*= dX;
			y*= dY;
			    this.setHome(x,y);
	};
}

if(Imported.YEP_BattleEngineCore)
{
	
	Sprite_EnemyRex.prototype.stepForward = function() {
    this.startMove(Yanfly.Param.BECStepDist, 0, 12);
};

	
}

  //-----------------------------------------------------------------------------
// Rex Functions
//=============================================================================


Rexal.ASVE.processEnemyNoteTag = function(obj) {

Rexal.ASVE._animated = false;
Rexal.ASVE._motion = 'thrust';
Rexal.ASVE._weaponID = 0;

if(obj == null)return;
		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		var lines = line.split(': ');
		
		switch (lines[0]) {
		
		case '[SV Animated]' :
        Rexal.ASVE._animated = true;
		break;
		
		case 'SV Motion' :
        Rexal.ASVE._motion = lines[1].toLowerCase();
		break;
		
		case 'SV Weapon' :
        Rexal.ASVE._weaponID = parseInt(lines[1]);
		break;	
		
		
		}
		
			
		}
		

};

 }