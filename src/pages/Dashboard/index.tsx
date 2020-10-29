
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FiPower, FiClock } from 'react-icons/fi';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import logoImg from '../../assets/logo.svg';
import {
   Container,
   Header,
   HeaderContent,
   Profile,
   Content,
   Schedule,
   Calendar,
   NextAppointment,
   Section,
   Appointment,
} from './styles';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface IMonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface IAppointment {
  id: string;
  date: string;
  formattedHour: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
   const { user, signOut } = useAuth();

   const [selectedDate, setSelectedDate] = useState(new Date());     // data selecionada
   const [currentMonth, setCurrentMonth] = useState(new Date());     // mes selecionado
   const [monthAvailability, setMonthAvailability] = useState<IMonthAvailabilityItem[]>([]);
   const [appointments, setAppointments] = useState<IAppointment[]>([]);

   const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
      // se o dia estiver disponivel e s@e nao estiver desabilitado
      if (modifiers.available && !modifiers.disabled) {
         setSelectedDate(day);
      }
   }, []);

   const handleMonthChange = useCallback((month: Date) => {
      setCurrentMonth(month);
   }, []);

    // disparar uma funcao toda vez que 1 ou mais variaveis mudarem
   useEffect(() => {
      api.get(`/providers/${user.id}/month-availability`, {
         params: {
            year: currentMonth.getFullYear(),
            month: currentMonth.getMonth() + 1,
         }
      }).then(response => {
         setMonthAvailability(response.data);
      })
   }, [currentMonth, user.id])

  useEffect(() => {
    api.get<IAppointment[]>('/appointments/me', {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      }).then(response => {
      const formattedAppointments = response.data.map(appointment => {
            // retorna todos os appointments e inclui o campo fornmattedHour
            return {
               ...appointment,
               formattedHour: format(parseISO(appointment.date), 'HH:mm'),
            };
         });
         setAppointments(formattedAppointments);
      });
  }, [selectedDate, currentMonth]);

   const disabledDays = useMemo(() => {
      const dates = monthAvailability
         .filter(monthDay => monthDay.available === false)
         .map(monthDay => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            return new Date(year, month, monthDay.day);
         });

         return dates;
   }, [currentMonth, monthAvailability])

   const selectedDateAsText = useMemo(() => {
      return format(selectedDate, "'Dia' dd 'de' MMMM", {
         locale: ptBR,
      });
   }, [selectedDate]);

   const selectedWeekDay = useMemo(() => {
      return format(selectedDate, 'cccc', {
         locale: ptBR,
      });
   }, [selectedDate]);

   const morningAppointments = useMemo(() => {
      return appointments.filter(appointment => parseISO(appointment.date).getHours() < 12,);
   }, [appointments]);

   const afternoonAppointments = useMemo(() => {
      return appointments.filter(appointment => parseISO(appointment.date).getHours() >= 12,);
   }, [appointments]);

   const nextAppointment = useMemo(() => {
      return appointments.find(appointment =>
         // ja esta ordenado por horario, entao busca o proximo registro depois de "agora" (isAfter)
         isAfter(parseISO(appointment.date), new Date()),
      );
   }, [appointments]);
 
   return (
      <Container>
         <Header>
            <HeaderContent>
               <img src={logoImg} alt="GoBarber logo" />

               <Profile>
                  <img src={user.avatar_url} alt={user.name} />
                  <div>
                     <span>Welcome,</span>
                     <Link to="/profile">
                        <strong>{user.name}</strong>
                     </Link>
                  </div>
               </Profile>
               <button type="button" onClick={signOut}>
                  <FiPower />
               </button>
            </HeaderContent>
         </Header>

         <Content>
            <Schedule>
               <h1>Horários agendados</h1>
               <p>
                  {isToday(selectedDate) && <span>Hoje</span>}
                  <span>{selectedDateAsText}</span>
                  <span>{selectedWeekDay}</span>
               </p>

               {isToday(selectedDate) && nextAppointment && (
                  <NextAppointment>
                     <strong>Próximo agendamento</strong>
                     <div>
                        <img 
                           src={nextAppointment.user.avatar_url}
                           alt={nextAppointment.user.name}
                        />

                        <strong>{nextAppointment.user.name}</strong>
                        <span>
                           <FiClock />
                           {nextAppointment.formattedHour}
                        </span>
                     </div>
                  </NextAppointment>
               )}

               <Section>
                  <strong>Manhã</strong>

                  {morningAppointments.length === 0 && (
                     <p>Nenhum agendamento no período da manhã.</p>
                  )}

                  {/* usamos parenteses pq queremos fazer um retorno direto */}
                  {morningAppointments.map(appointment => (
                     // quando usamos map, precisamos usar uma KEY
                     <Appointment key={appointment.id}>
                        <span>
                           <FiClock />
                           {appointment.formattedHour}
                        </span>
                        <div>
                           <img
                              src={appointment.user.avatar_url}
                              alt={appointment.user.name}
                           />

                           <strong>{appointment.user.name}</strong>
                        </div>
                     </Appointment>
                  ))}
               </Section>

               <Section>
                  <strong>Tarde</strong>

                  {afternoonAppointments.length === 0 && (
                     <p>Nenhum agendamentos no período da tarde.</p>
                  )}

                  {afternoonAppointments.map((appointment) => (
                     <Appointment key={appointment.id}>
                        <span>
                           <FiClock />
                           {appointment.formattedHour}
                        </span>
                        <div>
                           <img
                              src={appointment.user.avatar_url}
                              alt={appointment.user.name}
                           />
                           <strong>{appointment.user.name}</strong>
                        </div>
                     </Appointment>
                  ))}
               </Section>
            </Schedule>

            <Calendar>
               <DayPicker 
                  weekdaysShort={['D','S','T','Q','Q','S','S']}
                  fromMonth={new Date()}     // a partir do mes atual
                  disabledDays={[ 
                     {daysOfWeek: [0, 6]}, ...disabledDays      // domingo e sabado
                  ]}
                  modifiers={{
                     available: {daysOfWeek: [1, 2, 3, 4, 5]}  // segunda a sexta
                  }}
                  selectedDays={selectedDate}
                  onMonthChange={handleMonthChange}
                  onDayClick={handleDateChange}
                  months={[
                     'Janeiro',
                     'Fevereiro',
                     'Março',
                     'Abril',
                     'Maio',
                     'Junho',
                     'Julho',
                     'Agosto',
                     'Setembro',
                     'Outubro',
                     'Novembro',
                     'Dezembro'
                  ]}
               />
            </Calendar>
         </Content>
      </Container>
   );
};

export default Dashboard;