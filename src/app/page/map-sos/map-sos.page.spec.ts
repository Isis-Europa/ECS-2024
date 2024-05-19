import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapSosPage } from './map-sos.page';

describe('MapSosPage', () => {
  let component: MapSosPage;
  let fixture: ComponentFixture<MapSosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MapSosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
