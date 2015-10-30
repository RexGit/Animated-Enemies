//=============================================================================
// AnimatedEnemiesYanflyCompatability.js
// Version: 1.014
//=============================================================================

var Imported = Imported || {};
Imported.AnimatedSVEnemies.Yanfly = true;

var Rexal = Rexal || {};
Rexal.ASVE = Rexal.ASVE || {};
/*:
 * @plugindesc Version: 1.014 - the clickening
 * - Makes animatedSVEnemies compatible with Yanfly's plugins.
 * @author Rexal
 *
 * @help

 Version Log:
 
 v1 - Initial Version
 v1.01 - got rid of an unnecessary function.
 v1.011 - Forgot a bracket.
 v1.012b - Should be compatible with the lastest Battle Engine Core.
 v1.013 
 - fixed enemy positioning...kinda.
 - fixed floating monsters
 v1.014 - fixed mouse support...but you can't mix up the enemy types.
 */
 if(Imported.AnimatedSVEnemies){
	 

  //-----------------------------------------------------------------------------
// Core Engine
//=============================================================================

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
	
		Sprite_Enemy.prototype.setHome = function(x,y) {
			
			var dX = Graphics.boxWidth/816;
			var dY = Graphics.boxHeight/624;
			
			x*= dX;
			if(!Rexal.ASVE._float)y*= dY;
			
			this._homeX = x;
			this._homeY = y;
			this.updatePosition();
	};

}







  //-----------------------------------------------------------------------------
// Battle Engine Core
//=============================================================================

if(Imported.YEP_BattleEngineCore)
{
	
	
	Game_Enemy.prototype.spriteWidth = function() {
		
    if(!this.battler()) return 1;
	
	if (Rexal.ASVE._animated) {
			return this.battler()._mainSprite.width;
		} else {
			return this.battler().width;
		}
		
};

Game_Enemy.prototype.spriteHeight = function() {

	    if(!this.battler()) return 1;
		
    if (Rexal.ASVE._animated) {
			return this.battler()._mainSprite.height;
		} else {
			return this.battler().height;
		}
		
};
	
Sprite_EnemyRex.prototype.stepFlinch = function() {
		var flinchX = this.x - this._homeX + Yanfly.Param.BECFlinchDist;
		this.startMove(flinchX, 0, 6);
};

	
	Sprite_EnemyRex.prototype.stepForward = function() {
    this.startMove(Yanfly.Param.BECStepDist, 0, 12);
};




}



 }