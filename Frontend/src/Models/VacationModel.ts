class VacationModel {
  public vacationId: number;
  public countryId: number;
  public city: string;
  public hotel: string;
  public starsId: number;
  public boardId?: number;
  public airlineId: number;
  public luggageId?: number;
  public departureTime: string;
  public returnTime: string;
  public price: number;
  public description: string;
  public imagesFolder: string;

  //for join tables
  public countryName?: string;
  public boardName?: string;
  public airlineName?: string;
  public luggageName?: string;
}

export default VacationModel;
