class FollowerModel {
  public vacationId: number;
  public userId: number;

  public constructor(follower: FollowerModel) {
    this.vacationId = follower.vacationId;
    this.userId = follower.userId;
  }
}

export default FollowerModel;
