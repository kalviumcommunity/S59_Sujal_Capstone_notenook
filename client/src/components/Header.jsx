.dashboard {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 20px;
  height: 100%;
}

.stats{
    background-color: #D9EDEC;
}

.myNotes {
  grid-row: span 4;
  background-color: #E1FFE2;
}

.reviewList {
  grid-row: span 3;
  background-color: #FFF8B8;
}

.dashBoardComponent {
  padding: 1rem;
  border-radius: 5px;
}

.statDiv {
  margin-bottom: 20px;
  background-color: hsl(0, 0%, 100%);
  padding: 10px;
  border-radius: 5px;
  min-width: 140px;
  width: 45%;
}

.statDiv .iconDiv {
  padding: 5px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.statDiv .connectionsStat {
  background-color: #3498db;
}

.statDiv .notesStat {
  background-color: #2ecc71;
}

.statDiv div {
  display: flex;
  align-items: center;
}

.statDiv p {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: rgb(102, 102, 102);
}

.statNumber{
  font-weight: ;
}
@media (max-width: 780px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}
                                                                                                                                                                                                                                                                                                                                                                                   