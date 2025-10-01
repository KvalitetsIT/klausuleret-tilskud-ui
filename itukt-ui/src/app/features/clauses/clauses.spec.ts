// Angular test imports
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

// Komponent-halløj
import { Clauses } from './clauses';
import { ClausesService } from '../../services/clauses';
import { DslOutput } from '@api/models/dsl-output';

// Mock Management service
class MockClausesService {
  subject = new BehaviorSubject<DslOutput[]>([]);
  getClausesAsDsl() { return this.subject.asObservable(); }
}

describe('Clauses', () => {
  let fixture: ComponentFixture<Clauses>;
  let service: MockClausesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clauses], // standalone component
      providers: [
        { provide: ClausesService, useClass: MockClausesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Clauses);
    service = TestBed.inject(ClausesService) as unknown as MockClausesService;
    fixture.detectChanges();
  });

  it('viser "Henter..." når listen er tom (før data kommer)', () => {
    // Mock services har et tomt array til en start
    fixture.detectChanges();
    const loading = fixture.debugElement.query(By.css('.loading'));
    expect(loading?.nativeElement.textContent).toContain('Henter...');
  });

  it('viser en række når der kommer data', () => {
    // Arrange
    const dsl = "AGE >= 50";
    const row: DslOutput = { uuid: 'klausul123', dsl: dsl } as any;

    // Act
    service.subject.next([row]);
    fixture.detectChanges();

    // Assert: Ikke mere loading
    const loading = fixture.debugElement.query(By.css('.loading'));
    expect(loading).toBeNull();

    // Assert: Præcis 1 række ankommet
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);

    // Assert: Cellen indeholder DSL-teksten
    const cellText = rows[0].query(By.css('td .dsl')).nativeElement.textContent;
    expect(cellText).toContain(dsl);
  });

});
