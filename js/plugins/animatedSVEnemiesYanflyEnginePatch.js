//=============================================================================
// AnimatedEnemiesYanflyCompatability.js
// Version: 1.013
//=============================================================================

var Imported = Imported || {};
Imported.AnimatedSVEnemies.Yanfly = true;

var Rexal = Rexal || {};
Rexal.ASVE = Rexal.ASVE || {};
/*:
 * @plugindesc Version: 1.013
 * - Makes animatedSVEnemies compatible with Yanfly's plugins.
 * @author Rexal
 *
 * @help

 Version Log:
 
 v1 - Initial Version
 v1.01 - got rid of an unnecessary function.
 v1.011 - Forgot a bracket.
 v1.012b - Should be compatible with the lastest Battle Engine Core.
 v1.013 - Fixed the positioning for when you set a different screen resolution
 */
 if(Imported.AnimatedSVEnemies){
	 
	 

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
	
		Sprite_Enemy.prototype.setHome = function(x,y) {
			
			var dX = Graphics.boxWidth/816;
			var dY = Graphics.boxHeight/624;
			
			x*= dX;
			y*= dY;
			
			this._homeX = x;
			this._homeY = y;
			this.updatePosition();
	};

if(Imported.YEP_BattleEngineCore)
{
	
	Sprite_EnemyRex.prototype.stepForward = function() {
    this.startMove(Yanfly.Param.BECStepDist, 0, 12);
};

	
}

}




  //-----------------------------------------------------------------------------
// Rex Functions
//=============================================================================
 }