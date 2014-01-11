define(['collision-component', 'sat', 'collision-resolver', 'vector-2D', 'draw'],
	function(CollisionComponent, SAT, CollisionResolver, Vector2D, draw) {

		var p = {};
		var m = null;

		var Component = CollisionComponent.extend({
			start: function() {
				this._super();

				this.pointCount = this.points.length;
				this.pointsCopy = JSON.parse(JSON.stringify(this.points));

				this.collider = new SAT.FixedSizePolygon(new Vector2D(0, 0), this.points);
				this.colliderType = CollisionResolver.polygonCollider;
			},

			update: function() {
				this.parent.getTransform(p, m);

				this.collider.pos.x = p.x;
				this.collider.pos.y = p.y;

				this._super();
			},

			debug_draw: function(context) {
				this.parent.getTransform(p, m);

				context.save();
				context.setTransform(1, 0, 0, 1, 0, 0);			
				context.translate(p.x, p.y);

				draw.polygon(context, 0, 0, this.pointsCopy, null, this.debugColor, 2);
				context.restore();

				this._super();
			}
		});

		return Component;
	}
);